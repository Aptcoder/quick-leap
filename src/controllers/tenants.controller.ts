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
import { AuthTenantDTO, CreateTenantDTO } from "../common/dtos/users.dtos"
import validator from "../middlewares/validator"
import TenantService from "../services/tenant.service"

@controller("/tenants")
export default class TenantController extends BaseController {
    constructor(
        @inject("tenant_service") private readonly tenantService: TenantService
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

    @httpPost("/auth", validator({ body: AuthTenantDTO }))
    async authTenant(@request() req: Request, @response() res: Response) {
        try {
            const authTenantDto: AuthTenantDTO = req.body
            const tenant = await this.tenantService.auth(authTenantDto)
            return this.handleSuccess(res, "Tenant authenticated", tenant)
        } catch (err) {
            return this.handleError(res, err)
        }
    }
}
