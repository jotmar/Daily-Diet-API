import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string,
      username: string,
      email: string,
      password: string,
      session_id: string,
      created_at: string
    },

    diets: {
      id: string,
      name: string,
      description: string,
      date: string | date,
      diet: boolean,
      userID: string
    }
  }

}