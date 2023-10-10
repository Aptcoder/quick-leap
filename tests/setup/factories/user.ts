import { useSeederFactory } from "typeorm-extension"
import User from "../../../src/entities/user.entity"
import { AppDataSource } from "../../../src/loaders/db"
import bcrypt from "bcrypt"

export async function createUsers() {
    const password = await bcrypt.hash("password", 10)
    const user = await AppDataSource.manager.save(User, {
        email: "sample@sample.com",
        password: password,
        firstName: "dame",
        lastName: "msaun",
    })

    const user2 = await AppDataSource.manager.save(User, {
        email: "sample2@sample.com",
        password: password,
        firstName: "dame",
        lastName: "msaun",
    })

    return [user, user2]
}
