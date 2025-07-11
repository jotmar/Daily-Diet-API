import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary(),
    table.string('username').notNullable(),
    table.string('email').notNullable()
    table.string('password').notNullable(),
    table.uuid('session_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

