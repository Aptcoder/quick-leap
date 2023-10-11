import User from "../../src/entities/user.entity"
import { IRepository } from "../../src/common/interfaces/repositories.interface"
import { FindOptionsWhere } from "typeorm"
export const sampleUser: User = {
    email: "Sample@email.com",
    firstName: "Samuel",
    lastName: "Sample",
    password: "should be hashed",
    id: "random",
    verified: true,
    dateJoined: new Date(),

    toJSON() {
        return sampleUser
    },
}
export const mockUserRepository: IRepository<User> = {
    findOne: function (where: FindOptionsWhere<User>): Promise<User | null> {
        return Promise.resolve(sampleUser)
    },
    findMany: function (where: FindOptionsWhere<User>): Promise<User[]> {
        throw new Error("Function not implemented.")
    },
    create: function (data: any): Promise<User> {
        return Promise.resolve(data as User)
    },
    update: function (
        criteria: Partial<User>,
        update: Partial<User>
    ): Promise<any> {
        return Promise.resolve(Object.assign(sampleUser, update))
    },
}
