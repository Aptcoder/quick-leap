import { Request, Response } from "express"
import { inject } from "inversify"
import validator from "../middlewares/validator"
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    request,
    requestBody,
    response,
} from "inversify-express-utils"
import {
    AuthUserDTO,
    CreateUserDTO,
    VerifyTokenDTO,
    sendVerificationEmailDTO,
} from "../common/dtos/users.dtos"
import BaseController from "./base.controller"
import UserService from "../services/user.service"

@controller("")
export default class UserController extends BaseController {
    constructor(
        @inject("user_service") private readonly userService: UserService
    ) {
        super()
    }
    @httpGet("/users/self", "auth_middleware")
    async getUser(@request() req: Request, @response() res: Response) {
        try {
            const { id: userId } = req.user
            const user = await this.userService.getUser(userId)
            return this.handleSuccess(res, "Self", user)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost("/register", validator({ body: CreateUserDTO }))
    async createUser(@request() req: Request, @response() res: Response) {
        try {
            const createUserDto: CreateUserDTO = req.body
            const data = await this.userService.createUser(createUserDto)
            return this.handleSuccess(res, "User created", data, 201)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost("/login", validator({ body: AuthUserDTO }))
    async authTenant(@request() req: Request, @response() res: Response) {
        try {
            const authUserDto: AuthUserDTO = req.body
            const user = await this.userService.auth(authUserDto)
            return this.handleSuccess(res, "User authenticated", user, 200)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost(
        "/send-verification-email",
        validator({ body: sendVerificationEmailDTO })
    )
    async sendVerificationEmail(
        @request() req: Request,
        @response() res: Response
    ) {
        try {
            const verificationDto: sendVerificationEmailDTO = req.body
            const verificationToken =
                await this.userService.sendVerificationToken(
                    verificationDto.email
                )
            return this.handleSuccess(
                res,
                "Verification email sent",
                { verificationToken },
                200
            )
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpGet("/verify-email/:token", validator({ param: VerifyTokenDTO }))
    async verifyEmail(@request() req: Request, @response() res: Response) {
        try {
            const { token } = req.params
            await this.userService.verifyEmail(token)
            return this.handleSuccess(res, "User email verified")
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
