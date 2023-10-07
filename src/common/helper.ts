import { Response } from "express"

export default class Helper {
    static formatResponse(
        res: Response,
        message: string,
        data?: any,
        status: number = 200
    ) {
        return res.status(status).send({
            status: "success",
            message,
            data,
        })
    }
}
