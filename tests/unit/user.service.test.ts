import "reflect-metadata"
import { mockUserRepository, sampleUser } from "../mocks/user.repository.mock"
import UserService from "../../src/services/user.service"
import { caching, Cache } from "cache-manager"
import { Container } from "inversify"
import MailService from "../../src/common/services/mail"
import { APIError, ConflictError } from "../../src/common/errors"

describe("User service", () => {
    let userService: UserService
    let cache: Cache
    let mailService: MailService
    let verificationToken: string

    beforeEach(async () => {
        const container = new Container()
        container.bind("user_repository").toConstantValue(mockUserRepository)
        cache = await caching("memory")
        container.bind("cache_service").toConstantValue(cache)
        container.bind("user_service").to(UserService)

        mailService = new MailService()
        container.bind("mail_service").toConstantValue(mailService)

        userService = container.get("user_service")
        ;({ accessToken: verificationToken } =
            await userService.generateToken(sampleUser))

        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test("Service should create user", async () => {
        const userData = {
            firstName: "Samuel",
            lastName: "Testing",
            email: "samuel@testing.com",
            password: "hithere",
        }

        const findSpy = jest
            .spyOn(mockUserRepository, "findOne")
            .mockResolvedValue(null)
        const createSpy = jest.spyOn(mockUserRepository, "create")
        const mailSpy = jest.spyOn(mailService, "send")
        const user = await userService.createUser(userData)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(findSpy).toHaveBeenCalledWith({
            email: "samuel@testing.com",
        })

        expect(mailSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(1)
        expect(user.firstName).toBe(userData.firstName)
    })

    test("Service should throw error if user with email found", async () => {
        const userData = {
            firstName: "Samuel",
            lastName: "Testing",
            email: "samuel@testing.com",
            password: "hithere",
        }

        const findSpy = jest.spyOn(mockUserRepository, "findOne")
        const createSpy = jest.spyOn(mockUserRepository, "create")

        expect(async () => {
            await userService.createUser(userData)
        }).rejects.toBeInstanceOf(ConflictError)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(createSpy).toHaveBeenCalledTimes(0)
    })

    test("Service should auth user", async () => {
        const authData = {
            email: "damn",
            password: "good",
        }
        const findSpy = jest.spyOn(mockUserRepository, "findOne")
        const compareSpy = jest
            .spyOn(userService, "comparePassword")
            .mockResolvedValue(true)
        const generateSpy = jest.spyOn(userService, "generateToken")

        const result = await userService.auth(authData)
        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(compareSpy).toHaveBeenCalledTimes(1)
        expect(generateSpy).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject(
            expect.objectContaining({
                accessToken: expect.any(String),
            })
        )
    })

    test("Service should not auth user if password invalid", async () => {
        const authData = {
            email: "damn",
            password: "good",
        }

        const findSpy = jest.spyOn(mockUserRepository, "findOne")
        const generateSpy = jest.spyOn(userService, "generateToken")

        expect(async () => {
            await userService.auth(authData)
        }).rejects.toBeInstanceOf(APIError)

        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(generateSpy).not.toHaveBeenCalled()
    })

    test("Service should get user without cache if user detail not yet cached", async () => {
        const cacheSpy = jest.spyOn(cache, "get").mockResolvedValue(null)
        const cacheSetSpy = jest.spyOn(cache, "set")

        const findSpy = jest.spyOn(mockUserRepository, "findOne")
        const userDetail = await userService.getUser("random-id")

        expect(cacheSpy).toHaveBeenCalledTimes(1)
        expect(findSpy).toHaveBeenCalledTimes(1)
        expect(cacheSetSpy).toHaveBeenCalled()

        expect(userDetail).toBeTruthy()
    })

    test("Service should get user with cache if user detail cached", async () => {
        const cacheSpy = jest.spyOn(cache, "get").mockResolvedValue(
            JSON.stringify({
                ...sampleUser,
            })
        )
        const cacheSetSpy = jest.spyOn(cache, "set")

        const findSpy = jest.spyOn(mockUserRepository, "findOne")
        const userDetail = await userService.getUser("random-id")

        expect(cacheSpy).toHaveBeenCalledTimes(1)
        expect(findSpy).not.toHaveBeenCalled()
        expect(cacheSetSpy).not.toHaveBeenCalled()
        expect(userDetail).toBeTruthy()
    })

    test("Service should verify email", async () => {
        const tokenSpy = jest
            .spyOn(userService, "verifyToken")
            .mockResolvedValue({
                id: "user-id",
            })
        const findSpy = jest.spyOn(mockUserRepository, "findOne")
        const updateSpy = jest.spyOn(mockUserRepository, "update")
        await userService.verifyEmail(verificationToken)

        expect(findSpy).toBeCalledTimes(1)
        expect(tokenSpy).toBeCalledTimes(1)

        expect(tokenSpy).toBeCalledWith(verificationToken)

        expect(updateSpy).toBeCalledTimes(1)
    })
})
