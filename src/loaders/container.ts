import { Container } from "inversify"

// import controllers
import "../controllers"
import { AuthMiddleware } from "../middlewares/auth"
import { init } from "../common/services/cache/redis.setup"
import UserRepository from "../repositories/user.repository"
import UserService from "../services/user.service"

export const initContainer = async () => {
    const container = new Container()

    container.bind("user_repository").to(UserRepository)

    const redisCache = await init()
    container.bind("cache_service").toConstantValue(redisCache)
    container.bind("auth_middleware").to(AuthMiddleware)

    container.bind("user_service").to(UserService)

    return container
}
