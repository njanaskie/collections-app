import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Collection } from "../entities/Collection";
import { Like } from "../entities/Like";
import { CollectionEntry } from "../entities/CollectionEntry";
import { CorrectGuess } from "../entities/CorrectGuess";
// import path from "path";

const AppDataSource = new DataSource({
  type: "postgres",
  database: "collections",
  username: "postgres",
  password: "postgres",
  logging: true,
  synchronize: true, // TODO: turn off in production
  entities: [User, Collection, Like, CollectionEntry, CorrectGuess],
  // migrations: [path.join(__dirname, "./migrations/*")],
  migrations: ["dist/database/migrations/*.js"],
  // cli: {
  //     migrationsDir: "src/migrations"
  // },
});

export default AppDataSource;
