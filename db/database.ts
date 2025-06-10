import {knex as knexSetup} from "knex"
import { env } from "../src/env/setup"

export const config: knexSetup.Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts"
  }
}

export const knex = knexSetup(config)