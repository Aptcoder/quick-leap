import { Container } from "inversify"

// import controllers
import "../controllers"
import TenantService from "../services/tenant.service"
import LandlordService from "../services/landlord.service"
import TenantRepository from "../repositories/tenant.repository"
import LandlordRepository from "../repositories/landlord.repository"

export const initContainer = (): Container => {
    const container = new Container()

    container.bind("tenant_repository").to(TenantRepository)
    container.bind("landlord_repository").to(LandlordRepository)

    container.bind("tenant_service").to(TenantService)
    container.bind("landlord_service").to(LandlordService)
    return container
}
