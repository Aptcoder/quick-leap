import { Container } from "inversify"

// import controllers
import "../controllers"
import { AuthMiddleware } from "../middlewares/auth"
import { init } from "../common/services/cache/redis.setup"
import UserRepository from "../repositories/user.repository"
import UserService from "../services/user.service"
import MailService from "../common/services/mail"

export const initContainer = async () => {
    const container = new Container()

    container.bind("user_repository").to(UserRepository)

    const redisCache = await init()
    container.bind("cache_service").toConstantValue(redisCache)
    container.bind("mail_service").to(MailService)
    container.bind("auth_middleware").to(AuthMiddleware)

    container.bind("user_service").to(UserService)

    return container
}
