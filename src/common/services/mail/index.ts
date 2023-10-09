import sgMail, {
    MailDataRequired,
    MailService as SendgridMailService,
} from "@sendgrid/mail"
import config from "config"
import { injectable } from "inversify"

@injectable()
export default class MailService {
    private sendgrid: SendgridMailService
    constructor() {
        const api_key = config.get<string>("sendgrid_api_key")
        if (!api_key) {
            throw new Error("Sendgrid api key not set in config")
        }
        this.sendgrid = sgMail
        this.sendgrid.setApiKey(api_key)
    }

    async send(msg: MailDataRequired) {
        try {
            const response = await this.sendgrid.send(msg)
            console.log("Mail sent:", response)
            return response
        } catch (err) {
            console.log("Error sending mail:", err)
            return
        }
    }
}
