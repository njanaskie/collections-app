import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

const decodeAuthHeader = (context: MyContext) => {
  if (context.req.headers.authorization) {
    const parts = context.req.headers.authorization.split(" ");
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Basic$/i.test(scheme)) {
        return Buffer.from(credentials, "base64").toString("utf8");
      }
    }
  }
  return null;
};

export const verifyAuthHeader: MiddlewareFn<MyContext> = (
  { context },
  next
) => {
  const credentials = decodeAuthHeader(context);
  if (credentials) {
    const [username, password] = credentials.split(":");

    // Verify the username and password
    if (
      username === process.env.API_USERNAME &&
      password === process.env.API_PASSWORD
    ) {
      return next();
    } else {
      throw new Error("Invalid credentials");
    }
  } else {
    throw new Error("No credentials provided");
  }
};
