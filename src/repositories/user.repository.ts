import { injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import { AppDataSource } from "../loaders/db"
import { FindOptionsWhere } from "typeorm"
import User from "../entities/user.entity"

@injectable()
export default class UserRepository implements IRepository<User> {
    findOne(where: FindOptionsWhere<User>): Promise<User | null> {
        return AppDataSource.manager.findOne(User, { where })
    }
    findMany(where: FindOptionsWhere<User>): Promise<User[]> {
        return AppDataSource.manager.find(User, { where })
    }
    create(data: any): Promise<User> {
        const tenant = AppDataSource.manager.save(User, data)
        return tenant
    }
}
