import config from "config"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Inject, Service } from "typedi"
import { Cache } from "cache-manager"

@Service()
export class Auth {
    constructor(@Inject("cache_service") private cache: Cache) {}

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

    public auth =
        (roles: string[] = ["guest", "admin"]) =>
        async (req: Request, res: Response, next: NextFunction) => {
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

                const decoded = await this.verifyToken(token)
                req.user = decoded
                const { user } = req

                const cachedToken = await this.cache.get(user.id)
                if (!cachedToken || cachedToken !== token) {
                    return res.status(401).send({
                        message: "Not authorized, kindly log in",
                        status: "failed",
                        data: {},
                    })
                }

                if (!roles.includes(user.role.toString()))
                    return res.status(403).send({
                        message: "Not authorized.",
                        status: "failed",
                        data: {},
                    })

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
