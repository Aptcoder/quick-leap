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
import { ILandlordService } from "../common/interfaces/services.interface"
import BaseController from "./base.controller"
import { CreateLandlordDTO } from "../common/dtos/users.dtos"

@controller("/landlords")
export default class LandlordController extends BaseController {
    constructor(
        @inject("landlord_service")
        private readonly landlordService: ILandlordService
    ) {
        super()
    }
    @httpGet("/")
    async getLandlords(@request() req: Request, @response() res: Response) {
        try {
            const landlords = await this.landlordService.getLandlords()
            return this.handleSuccess(res, "Landlords", landlords)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost("/")
    async createTenant(@request() req: Request, @response() res: Response) {
        try {
            const createLandlordDto: CreateLandlordDTO = req.body
            const landlord =
                await this.landlordService.createLandlord(createLandlordDto)
            return this.handleSuccess(res, "Landlord created", landlord)
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
