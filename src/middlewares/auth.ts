import config from "config"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { inject, injectable } from "inversify"
import { BaseMiddleware } from "inversify-express-utils"
import { ParamsDictionary } from "express-serve-static-core"
import { ParsedQs } from "qs"
import { Cache } from "cache-manager"
import User from "../entities/user.entity"

export type Session = {
    userType: "landlord" | "tenant"
    userId: string
}

@injectable()
export class AuthMiddleware extends BaseMiddleware {
    constructor(@inject("cache_service") private cache: Cache) {
        super()
    }

    private verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                config.get<string>("jwtSecret"),
                (err: any, decoded: unknown) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(decoded)
                }
            )
        })
    }

    public async handler(
        req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
        res: Response<any, Record<string, any>>,
        next: NextFunction
    ) {
        try {
            const AuthorizationHeader = req.header("Authorization")
            if (!AuthorizationHeader) {
                return res.status(401).send({
                    message: "Not allowed, Kindly log in",
                    status: "failed",
                    data: {},
                })
            }

            const [bearer, token] = AuthorizationHeader.split(" ")
            if (!bearer || !token) {
                return res.status(401).send({
                    message: "Not authorized, kindly log in",
                    status: "failed",
                    data: {},
                })
            }

            await this.verifyToken(token)

            const userId = await this.cache.get(token)
            if (!userId) {
                return res.status(401).send({
                    message: "Not authorized, kindly log in",
                    status: "failed",
                    data: {},
                })
            }

            req.user = { id: userId as string } as User

            return next()
        } catch (err) {
            return res.status(401).send({
                message: "Not authorized, kindly log in",
                status: "failed",
                data: {},
            })
        }
    }
}

export const authUserType = (type: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const session = req.session
        if (!session) {
            return res.status(403).send({
                message: "Not authorized.",
                status: "failed",
                data: {},
            })
        }

        if (session.userType != type) {
            return res.status(403).send({
                message: "Not authorized.",
                status: "failed",
                data: {},
            })
        }

        return next()
    }
}
