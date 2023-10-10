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
import UserService from "../../src/services/user.service"

describe("/users", () => {
    let app: Application
    let ds: DataSource
    let accessToken: string
    let user: Omit<User, "password">
    let verificationToken: string
    beforeAll(async () => {
        const container = await initContainer()

        const coreApp = new App(container)
        app = coreApp.build()
        await initDb()
        ds = await setupDb()

        const userService = container.get<UserService>("user_service")
        // const ds = await setupDb()
        await createUsers()
        ;({ accessToken: accessToken, user: user } = await userService.auth({
            email: "sample@sample.com",
            password: "password",
        }))
        ;({ accessToken: verificationToken } = await userService.generateToken(
            user as User
        ))
    })
    describe("GET /users/self - User get own details", () => {
        test("Should fetch user's details", async () => {
            const res = await request(app)
                .get("/api/users/self")
                .set("Authorization", `Bearer ${accessToken}`)
            expect(res.statusCode).toBe(200)
            expect(res.body).toMatchObject({
                status: "success",
                data: expect.objectContaining({
                    email: "sample@sample.com",
                }),
            })
        })

        test("Should not fetch user if user not authenticated", async () => {
            const res = await request(app).get("/api/users/self")
            expect(res.statusCode).toBe(401)
            expect(res.body).toMatchObject({
                status: "failed",
            })
        })
    })

    describe("POST /api/login - login user", () => {
        test("Should login user", async () => {
            const res = await request(app).post("/api/login").send({
                email: "sample2@sample.com",
                password: "password",
            })
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

    describe("GET /api/verifify-email - verify user email", () => {
        test("Should verify user email if token is valid", async () => {
            const res = await request(app).get(
                `/api/verify-email/${verificationToken}`
            )

            expect(res.statusCode).toBe(200)

            const verifiedUser = await ds.manager.findOne(User, {
                where: {
                    id: user.id,
                },
            })

            expect(verifiedUser).toBeTruthy()
            expect(verifiedUser?.verified).toBe(true)
        })

        test("Should not verify user email if token is not valid", async () => {
            const res = await request(app).get(
                `/api/verify-email/invalid-token`
            )

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
