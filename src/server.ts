import "reflect-metadata"
import config from "config"
import logger from "./common/services/logger"
import App from "./loaders/app"
import http from "http"
import { initDb } from "./loaders/db"

const PORT: string = config.get<string>("port")

async function startServer() {
    try {
        const app = new App()
        const appServer = app.build()
        const httpServer = http.createServer(appServer)

        await initDb()
        logger.info("📦  Database Connected!")

        httpServer.listen(config.get("port"))
        httpServer.on("listening", () =>
            logger.info(
                `🚀  Server running in ${config.get("env")}. Listening on ` +
                    config.get("port")
            )
        )
    } catch (err) {
        logger.error("Fatal server error", err)
    }
}

startServer()
