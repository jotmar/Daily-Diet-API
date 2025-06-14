import {it, describe, beforeAll, afterAll, beforeEach, expect} from "vitest"
import request from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"
import { knex } from "../db/database"
import {z} from "zod"

async function createLoginUser() {
  await request(app.server).post('/users/register').send({
    username: "testing",
    email: "testing@gmail.com",
    password: "password.123"
  }).expect(201)

  const response = await request(app.server).post('/users/login').send({
    email: "testing@gmail.com",
    password: 'password.123'
  }).expect(200)

  const cookieSchema = z.array(z.string())

  return cookieSchema.parse(response.get('Set-Cookie'))
}


describe('Diets Routes', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be possible to create a new diet', async () => {
    const cookie = await createLoginUser()

    const [name, description, diet] = ["Testing Diet", "A delicious test", false]

    await request(app.server).post('/diets').send({
      name,
      description,
      diet
    })
    .set("Cookie", cookie)
    .expect(201)

    const data = await knex('diets').where({
      name,
      description,
      diet
    }).first()

    expect(data)
  })

  it('should be possible to list all diets', async () => {
    const cookie = await createLoginUser()

    const [name, description, diet] = ["Testing Diet", "A delicious test", false]

    for (let i = 0; i < 1; i++){
      await request(app.server).post('/diets').send({
        name,
        description,
        diet
      }).set("Cookie", cookie).expect(201)

    }
    
    const response = await request(app.server)
    .get('/diets')
    .set("Cookie", cookie)
    .expect(200)

    expect(response.body.diets).toEqual(
      expect.arrayContaining(
        [
          expect.objectContaining({
            name,
            description,
            diet: 0,
          })
        ]
      )
    )
  })

  it('should be possible to list a single diet', async () => {
    const cookie = await createLoginUser()

    const [name, description, diet] = ["Testing Diet", "A delicious test", false]

    await request(app.server).post('/diets')
      .set("Cookie", cookie)
      .send({
        name,
        description,
        diet
      }).expect(201)

    const listAllDiets = await request(app.server).get('/diets').set("Cookie", cookie).expect(200)

    const id = listAllDiets.body.diets[0].id

    const getSingleDiet = await request(app.server).get(`/diets/${id}`).set('Cookie', cookie).expect(200)

    expect(getSingleDiet.body.diet).toEqual(
      expect.objectContaining({
        name,
        description,
        diet: 0
      })
    )
    
  })

  it('should be possible to update a diet', async () => {
    const cookie = await createLoginUser()

    const [name, description, diet] = ["Testing Diet", "A delicious diet", false]

    const [nameAlt, descriptionAlt, dietAlt] = ["Alternative Diet", "Nutritive Diet", true]

    await request(app.server).post('/diets').send({
      name,
      description,
      diet
    })
    .set("Cookie", cookie)
    .expect(201)

    /* Diet ID */

    const id = (await request(app.server).get('/diets').set("Cookie", cookie).expect(200)).body.diets[0].id

    /* Updating the diet with new values */
    
    await request(app.server).put(`/diets/${id}`).set("Cookie", cookie)
    .send({
      name: nameAlt,
      description: descriptionAlt,
      diet: dietAlt
    }).expect(204)

    const updatedDiet = await request(app.server).get('/diets').set('Cookie', cookie).expect(200)

    /* Checking updated diet */

    expect(updatedDiet.body.diets).toEqual([
      expect.objectContaining({
        name: nameAlt,
        description: descriptionAlt,
        diet: 1
      })
    ])
  })

  it('should be possible to delete a diet', async () => {
    const cookie = await createLoginUser()

    /* Create new diet */

    const [name, description, diet] = ["Testing Diet", "A delicious diet", false]

    await request(app.server).post('/diets').send({
      name,
      description,
      diet
    }).set("Cookie", cookie)
    .expect(201)

    /* Get new diet ID */

    const id = (await request(app.server).get('/diets').set('Cookie', cookie).expect(200)).body.diets[0].id

    /* Deleting the diet */

    await request(app.server).delete(`/diets/${id}`).set("Cookie", cookie).expect(204)

    /* Check if de diet is has been deleted */

    const getDiet = await request(app.server).get(`/diets/${id}`).set("Cookie", cookie).expect(404)

  })

  it('should be possible to get the user metrics', async () => {
    const cookie = await createLoginUser()

    const [name, description, diet] = ["Testing Diet", "A delicious test", false]

    /* Create diets */

    for (let i = 0; i < 2; i++) {

      await request(app.server).post('/diets').send({
        name,
        description,
        diet
      }).set("Cookie", cookie)
      .expect(201)
    }

    /* Get the metrics */

    const metrics = await request(app.server).get('/diets/metrics').set('Cookie', cookie).expect(200)

    /* Checking the metrics */

    expect(metrics.body.metrics).toEqual(
      expect.objectContaining({
        total: 2,
        diet: 0,
        offDiet: 2,
        maxSeq: 0,
      })
    )
  })
})