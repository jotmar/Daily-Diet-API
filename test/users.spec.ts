import {it, describe, beforeAll, afterAll, beforeEach, expect} from "vitest"
import request from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"
import { knex } from "../db/database"

describe("User Routes", () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be possible to register a new user.', async () => {
    await request(app.server).post('/users/register').send({
      username: "testing",
      email: "testing@gmail.com",
      password: "senha.123"
    }).expect(201)
  })

  it('should be possible to login to a new user', async () => {
    await request(app.server).post('/users/register').send({
      username: "testing",
      email: "test@gmail.com",
      password: "senha.123"
    }).expect(201)

    const newUserSession = await knex('users').where('username', "testing").select('session_id').first()
    let sessionID = ""

    const response = await request(app.server).post('/users/login').send({
      email: "test@gmail.com",
      password: "senha.123"
    }).expect(200)

    const cookies = response.get('Set-Cookie')

    expect(cookies !== undefined)
    if (cookies !== undefined) {
      sessionID = cookies[0].split(';')[0].split('=')[1]

    }

    expect(newUserSession?.session_id === sessionID)
  })
})