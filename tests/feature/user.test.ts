import "reflect-metadata"
import express, { Application } from "express"
import { setupDb, setupForTests } from "../setup"
import { DataSource } from "typeorm"
import request from "supertest"
import User from "../../src/entities/user.entity"
import { createUsers } from "../setup/factories/user"
import { initContainer } from "../../src/loaders/container"
import App from "../../src/loaders/app"
import { initDb } from "../../src/loaders/db"

describe("/users", () => {
    let app: Application
    let ds: DataSource
    let adminAccessToken: string
    beforeAll(async () => {
        const container = await initContainer()

        const coreApp = new App(container)
        app = coreApp.build()
        await initDb()
        ds = await setupDb()

        // const userService = container.get<UserService>("user_service")
        // const ds = await setupDb()
        await createUsers()
        // ;({ accessToken: adminAccessToken, user: adminUser } =
        //     await userService.auth({
        //         email: "sample@sample.com",
        //         password: "password",
        //     }))
    })
    // describe("GET /users", () => {
    //     test("Should fetch all users", async () => {
    //         const res = await request(app)
    //             .get("/api/users")
    //             .set("Authorization", `Bearer ${adminAccessToken}`)
    //         expect(res.statusCode).toBe(200)
    //         expect(res.body).toMatchObject({
    //             status: "success",
    //             data: {
    //                 users: expect.any(Array),
    //             },
    //         })
    //     })

    //     test("Should not fetch users if user not authenticated", async () => {
    //         const res = await request(app).get("/api/users")
    //         expect(res.statusCode).toBe(401)
    //         expect(res.body).toMatchObject({
    //             status: "failed",
    //         })
    //     })
    // })

    describe("POST /api/login - login user", () => {
        test("Should login user", async () => {
            const res = await request(app).post("/api/login").send({
                email: "sample2@sample.com",
                password: "password",
            })

            console.log("res", res)
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
                data: {
                    accessToken: expect.any(String),
                    user: expect.objectContaining({
                        email: "sample2@sample.com",
                    }),
                },
            })
        })

        test("Should not auth user if password is wrong", async () => {
            const res = await request(app).post("/api/login").send({
                email: "sample2@sample.com",
                password: "wrong password",
            })
            expect(res.statusCode).toBe(401)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    describe("POST /api/register/ - Register new user", () => {
        test("Should create new user", async () => {
            const res = await request(app).post("/api/register").send({
                email: "created@sample.com",
                password: "StrongPassword20?",
                firstName: "created",
                lastName: "user",
            })
            expect(res.statusCode).toBe(201)
            expect(res.body).toMatchObject({
                status: "success",
                data: expect.objectContaining({
                    email: "created@sample.com",
                }),
            })

            const user = await ds.manager.findOne(User, {
                where: {
                    email: "created@sample.com",
                },
            })
            expect(user).toBeTruthy()
        })

        test("Should not create new user with weak password", async () => {
            const res = await request(app).post("/api/register").send({
                email: "created@sample.com",
                password: "weakassword",
                firstName: "created",
                lastName: "user",
            })
            expect(res.statusCode).toBe(400)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })

        test("Should not create new user with invalid email", async () => {
            const res = await request(app).post("/api/register").send({
                email: "invalidsample.com",
                password: "StrongPassword20?",
                firstName: "created",
                lastName: "user",
            })
            expect(res.statusCode).toBe(400)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    afterAll(() => {
        ds.destroy()
    })
})
