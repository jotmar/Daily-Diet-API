import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diets', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('date').notNullable()
    table.boolean('diet').notNullable()
    table.uuid('userID').notNullable()
  })
  
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diets')
}

