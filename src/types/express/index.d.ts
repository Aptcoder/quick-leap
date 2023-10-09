import User from "../../entities/user.entity"
import { Session } from "../../middlewares/auth"
// to make the file a module and avoid the TypeScript error
export {}

declare global {
    namespace Express {
        export interface Request {
            user: User
            session: Session
        }
    }
}
