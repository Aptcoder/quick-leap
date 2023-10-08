import { Response } from "express"
import { injectable } from "inversify"

@injectable()
export default class BaseController {
    handleSuccess(
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

    handleError(res: Response, err: any) {
        const message = err.message || "Something unexpected happened"
        return res.status(err.status || 500).send({
            status: "failed",
            message,
        })
    }
}
