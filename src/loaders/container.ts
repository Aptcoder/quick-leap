import { Container } from "inversify"

// import controllers
import "../controllers"
import TenantService from "../services/tenant.service"
import LandlordService from "../services/landlord.service"
import TenantRepository from "../repositories/tenant.repository"
import LandlordRepository from "../repositories/landlord.repository"
import HouseRepository from "../repositories/house.repository"
import HouseService from "../services/house.service"
import { AuthMiddleware } from "../middlewares/auth"
import { init } from "../common/services/cache/redis.setup"

export const initContainer = async () => {
    const container = new Container()

    container.bind("tenant_repository").to(TenantRepository)
    container.bind("landlord_repository").to(LandlordRepository)
    container.bind("house_repository").to(HouseRepository)

    const redisCache = await init()
    container.bind("cache_service").toConstantValue(redisCache)
    container.bind("auth_middleware").to(AuthMiddleware)

    container.bind("tenant_service").to(TenantService)
    container.bind("landlord_service").to(LandlordService)
    container.bind("house_service").to(HouseService)

    return container
}
