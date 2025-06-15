import {knex as knexSetup} from "knex"
import { env } from "../src/env/setup"

let connection = {}

if (env.DATABASE_CLIENT === "sqlite3") {
  connection = {
    filename: env.DATABASE_URL
  }
} else if (env.DATABASE_CLIENT === "pg") {
  connection = env.DATABASE_URL
}

export const config: knexSetup.Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection,
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts"
  }
}

export const knex = knexSetup(config)