import {it, describe, beforeAll, afterAll, beforeEach, expect} from "vitest"
import request from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"
import { knex } from "../db/database"

async function createLoginUser() {


}


describe('Diets Routes', () => {

  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be possible to create a new diet', async () => {
    /* const cookie = createLoginUser()
    expect(true) */
    createLoginUser()
  })

})