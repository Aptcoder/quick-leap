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
import { ITenantService } from "../common/interfaces/services.interface"
import BaseController from "./base.controller"
import { CreateTenantDTO } from "../common/dtos/users.dtos"
import validator from "../middlewares/validator"

@controller("/tenants")
export default class TenantController extends BaseController {
    constructor(
        @inject("tenant_service") private readonly tenantService: ITenantService
    ) {
        super()
    }
    @httpGet("/")
    async getTenants(@request() req: Request, @response() res: Response) {
        try {
            const tenants = await this.tenantService.getTenants()
            return this.handleSuccess(res, "Tenants", tenants)
        } catch (err) {
            return this.handleError(res, err)
        }
    }

    @httpPost("/", validator({ body: CreateTenantDTO }))
    async createTenant(@request() req: Request, @response() res: Response) {
        try {
            const createTenantDto: CreateTenantDTO = req.body
            const tenant =
                await this.tenantService.createTenant(createTenantDto)
            return this.handleSuccess(res, "Tenant created", tenant)
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
