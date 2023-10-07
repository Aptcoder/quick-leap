import { validateOrReject, ValidationError } from "class-validator"
import { NextFunction, Request, Response } from "express"
type Class = {
    new (...args: any[]): any
}
type validatorData = {
    body?: Class
    param?: Class
    query?: Class
}

const getMessageFromErrors = (errors: ValidationError[]) => {
    const error = errors[0]
    const message = Object.values(error.constraints!)[0]
    return message
}

export default function validator(data: validatorData) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!res || !req) {
            throw new Error(
                "Express request and response objects should be the first and second arguments"
            )
        }
        const requestBody = req.body
        const requestParams = req.params
        const requestQuery = req.query

        const promiseSet = []
        if (data.body) {
            const toValidate = new data.body()
            Object.assign(toValidate, requestBody)
            promiseSet.push(validateOrReject(toValidate))
        }

        if (data.param) {
            const toValidate = new data.param()
            Object.assign(toValidate, requestParams)
            promiseSet.push(validateOrReject(toValidate))
        }

        if (data.query) {
            const toValidate = new data.query()
            Object.assign(toValidate, requestQuery)
            promiseSet.push(validateOrReject(toValidate))
        }

        Promise.all(promiseSet)
            .then(() => {
                next()
            })
            .catch((errors) => {
                return res.status(400).send({
                    status: "failed",
                    message: getMessageFromErrors(errors),
                })
            })
    }
}
