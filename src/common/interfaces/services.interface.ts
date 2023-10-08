import Landlord from "src/entities/landlord.entity"
import Tenant from "../../entities/tenant.entity"
import { CreateTenantDTO } from "../dtos/users.dtos"

export interface ITenantService {
    createTenant(createTenantDto: CreateTenantDTO): Promise<Tenant>
    getTenants(): Promise<Tenant[]>
}

export interface ILandlordService {
    createLandlord(createTenantDto: CreateTenantDTO): Promise<Landlord>
    getLandlords(): Promise<Landlord[]>
}
