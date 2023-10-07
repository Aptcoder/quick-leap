import { Request, Response } from "express"
import { inject } from "inversify"
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    request,
    requestBody,
    response,
} from "inversify-express-utils"

@controller("/users")
export default class UserController {
    @httpGet("/")
    async getUser(@request() req: Request, @response() res: Response) {
        try {
            return "Working"
        } catch (err) {
            return "Not working"
        }
    }
}
