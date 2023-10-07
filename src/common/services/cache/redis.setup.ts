import { caching } from "cache-manager"
import { RedisStore, redisStore } from "cache-manager-redis-yet"
import config from "config"

export const init = async (logger: any) => {
    try {
        if (process.env.NODE_ENV == "test") {
            return caching("memory")
        }
        var redisConfig = {
            url: config.get<string>("redis_url"),
            ttl: 60 * 60 * 60,
        }
        var redisCache = await caching(redisStore, redisConfig)

        // listen for redis connection error event
        var redisClient = redisCache.store.client

        await redisCache.set("let see", "hi")

        logger.info("Redis connection done!")
        redisClient.on("error", (error: any) => {
            logger.error(`Redis Error: ${error}`)
        })

        return redisCache
    } catch (err) {
        logger.error(`Could not connect! ${err}`)
        process.exit(1)
    }
}
