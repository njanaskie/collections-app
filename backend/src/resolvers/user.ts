import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Mutation,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
  Root,
  FieldResolver,
  Int,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import AppDataSource from "../database/dataSource";
import { FieldError } from "./FieldError";
import { isAuth } from "../middleware/isAuth";
import { UserAttributesInput } from "./UserAttributesInput";
import { validateUpdateUser } from "../utils/validateUpdateUser";
import { validateLogin } from "../utils/validateLogin";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => Int)
  async totalLikesReceived(
    @Root() user: User,
    @Ctx() { collectionsByUserLoader }: MyContext
  ) {
    const collections = await collectionsByUserLoader.load({
      creatorId: user.id,
    });

    // return sum of all points in all collections
    const pointsSum = collections?.reduce((acc, curr) => {
      return acc + curr.points;
    }, 0);

    return pointsSum || 0;
  }

  @FieldResolver(() => Int)
  async totalCorrectGuesses(
    @Root() user: User,
    @Ctx() { correctGuessesByUserLoader }: MyContext
  ) {
    const cgs = await correctGuessesByUserLoader.load({
      guesserId: user.id,
    });

    return cgs?.length || 0;
  }

  @Mutation(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("attributes") attributes: UserAttributesInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse | null> {
    const errors = validateUpdateUser(attributes);
    if (errors) {
      return { errors };
    }

    // this is the current user
    if (req.session.userId !== id) {
      return {
        errors: [
          {
            field: "email",
            message: "There is a user ID mismatch",
          },
        ],
      };
    }

    let user;
    try {
      const result = await AppDataSource.createQueryBuilder()
        .update(User)
        .set(attributes)
        .where("id = :id", {
          id: req.session.userId,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (error) {
      // || error.detail.includes("already exists")) {
      // duplicate username error
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "Email already exists",
            },
          ],
        };
      }
    }

    return { user };
  }

  @Query(() => UserResponse, { nullable: true })
  async user(
    @Arg("id", () => Int) id: number,
    @Ctx() { userLoader }: MyContext
  ): Promise<UserResponse | null> {
    const user = await userLoader.load(id);
    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "User doesn't exist",
          },
        ],
      };
    }
    return { user };
  }

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token Expired",
          },
        ],
      };
    }
    const userIdNum = parseInt(userId);
    const user = await User.findOneBy({ id: userIdNum });
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no Longer Exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    await redis.del(key);

    // login user after change password
    req.session.userId = user.id;

    return { user };
  }
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOneBy({ email });
    if (!user) {
      // email is not in DB
      return true; // do nothing
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    sendEmail(
      email,
      `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">Reset Password</a>`
    );
    return true;
  }
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOneBy({ id: req.session.userId });
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      // or use ORM
      // User.create({
      //   username: options.username,
      //   email: options.email,
      //   password: hashedPassword,
      // }).save();
      user = result.raw[0];
    } catch (error) {
      // || error.detail.includes("already exists")) {
      // duplicate username error
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "Username has already been taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateLogin(usernameOrEmail, password);
    if (errors) {
      return { errors };
    }

    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "That username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
