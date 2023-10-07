import { Container } from "inversify"

// import controllers
import "../controllers"

export const initContainer = (): Container => {
    const container = new Container()
    return container
}
