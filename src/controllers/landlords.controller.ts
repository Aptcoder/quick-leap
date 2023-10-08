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
import { AuthLandlordDTO, CreateLandlordDTO } from "../common/dtos/users.dtos"
import validator from "../middlewares/validator"
import LandlordService from "../services/landlord.service"

@controller("/landlords")
export default class LandlordController extends BaseController {
    constructor(
        @inject("landlord_service")
        private readonly landlordService: LandlordService
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

    @httpPost("/", validator({ body: CreateLandlordDTO }))
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

    @httpPost("/auth", validator({ body: AuthLandlordDTO }))
    async authTenant(@request() req: Request, @response() res: Response) {
        try {
            const authTenantDto: AuthLandlordDTO = req.body
            const landlord = await this.landlordService.auth(authTenantDto)
            return this.handleSuccess(res, "Landlord authenticated", landlord)
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
