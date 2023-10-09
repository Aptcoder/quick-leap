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
    async create(data: any): Promise<User> {
        const tenant = await AppDataSource.manager.save(User, data)
        return tenant
    }

    async update(criteria: Partial<User>, updateData: Partial<User>) {
        const update = await AppDataSource.manager.update(
            User,
            criteria,
            updateData
        )

        return update
    }
}
