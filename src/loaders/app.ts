import express, { Application, NextFunction, Request, Response } from "express"
import { InversifyExpressServer } from "inversify-express-utils"
import cors from "cors"
import helmet from "helmet"
import { initContainer } from "./container"
import logger from "../common/services/logger"
import { APIError } from "../common/errors"

export default class App {
    private server: InversifyExpressServer

    constructor() {
        const container = initContainer()
        this.server = new InversifyExpressServer(container, null, {
            rootPath: "/api",
        })

        this.registerMiddlewares()
        this.registerHandlers()
    }

    /**
     * Registers middlewares on the application server
     */
    private registerMiddlewares() {
        this.server.setConfig((app: Application) => {
            app.use(express.json())
            app.use(express.urlencoded({ extended: false }))

            app.disable("x-powered-by")
            app.use(helmet())
            app.use(cors())
        })
    }

    /**
     * Registers utility handlers
     */
    private registerHandlers() {
        this.server.setErrorConfig((app: Application) => {
            app.use("*", (req: Request, res: Response) =>
                res.status(404).send({
                    status: "failed",
                    message: "Endpoint not found",
                    data: {},
                })
            )

            app.use(
                (err: any, req: Request, res: Response, next: NextFunction) => {
                    if (!(err instanceof APIError)) {
                        logger.error(`Unexpected error: ${err}`)
                    }
                    if (err.type && err.type === "entity.parse.failed") {
                        return res
                            .status(400)
                            .send({ status: "failed", message: err.message }) // Bad request
                    }
                    const message =
                        err.message || "Something unexpected happened"
                    return res.status(err.status || 500).send({
                        status: "failed",
                        message,
                    })
                }
            )
        })
    }

    /**
     * Applies all routes and configuration to the server, returning the express application server.
     */
    build() {
        return this.server.build()
    }
}
