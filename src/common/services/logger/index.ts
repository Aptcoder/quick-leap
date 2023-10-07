import winston from "winston"

export class LoggerService {
    private readonly logger
    constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
            ],
        })
    }

    info(message: string) {
        return this.logger.info(message)
    }

    warn(message: string) {
        return this.logger.info(message)
    }

    error(message: string, meta?: any) {
        return this.logger.error(message, meta)
    }
}

export default new LoggerService()
