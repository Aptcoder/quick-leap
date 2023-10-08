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
import BaseController from "./base.controller"
import validator from "../middlewares/validator"
import HouseService from "../services/house.service"
import { CreateHouseDTO } from "../common/dtos/house.dtos"
import { authUserType } from "../middlewares/auth"

@controller("/houses")
export default class HouseController extends BaseController {
    constructor(
        @inject("house_service")
        private readonly houseService: HouseService
    ) {
        super()
    }
    @httpGet("/")
    async getHouses(@request() req: Request, @response() res: Response) {
        try {
            const houses = await this.houseService.getHouses()
            return this.handleSuccess(res, "Houses", houses)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost(
        "/",
        "auth_middleware",
        authUserType("landlord"),
        validator({ body: CreateHouseDTO })
    )
    async createHouse(@request() req: Request, @response() res: Response) {
        try {
            const { userId: landlordId } = req.session
            const createHouseDto: CreateHouseDTO = req.body
            const house = await this.houseService.createHouse(
                createHouseDto,
                landlordId
            )
            return this.handleSuccess(res, "House created", house)
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
