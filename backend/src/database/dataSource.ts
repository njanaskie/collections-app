// import { Appeal } from "../entities/Appeal";
// import { Collection } from "../entities/Collection";
// import { CollectionEntry } from "../entities/CollectionEntry";
// import { CorrectGuess } from "../entities/CorrectGuess";
// import { Leaderboard } from "../entities/Leaderboard";
// import { SavedCollection } from "../entities/SavedCollection";
// import { User } from "../entities/User";
// import { Like } from "../entities/Like";
import { DataSource } from "typeorm";
// import path from "path";

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  // // port: parseInt(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  logging: true,
  synchronize: false,
  extra: {
    statement_timeout: 60000, // 60s
  },
  entities: ["dist/entities/*.js"],
  // entities: [
  //   User,
  //   Collection,
  //   Like,
  //   CollectionEntry,
  //   CorrectGuess,
  //   Appeal,
  //   SavedCollection,
  //   Leaderboard,
  // ],
  // migrations: [path.join(__dirname, "./migrations/*")],
  migrations: ["dist/database/migrations/*.js"],
  // entities:
  //   process.env.NODE_ENV === "production"
  //     ? ["dist/entities/*.js"]
  //     : [path.join(__dirname, "./entities/*.ts")],
  // migrations:
  //   process.env.NODE_ENV === "production"
  //     ? ["dist/database/migrations/*.js"]
  //     : [path.join(__dirname, "./database/migrations/*.ts")],
});

export default AppDataSource;
