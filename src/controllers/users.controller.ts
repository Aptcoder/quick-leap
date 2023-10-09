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
import { AuthUserDTO, CreateUserDTO } from "../common/dtos/users.dtos"
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
            const tenant = await this.userService.createUser(createUserDto)
            return this.handleSuccess(res, "User created", tenant)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost("/login", validator({ body: AuthUserDTO }))
    async authTenant(@request() req: Request, @response() res: Response) {
        try {
            const authTenantDto: AuthUserDTO = req.body
            const tenant = await this.userService.auth(authTenantDto)
            return this.handleSuccess(res, "User authenticated", tenant)
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
