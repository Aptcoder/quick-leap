import { injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import { AppDataSource } from "../loaders/db"
import { FindManyOptions, FindOptionsWhere } from "typeorm"
import Landlord from "../entities/landlord.entity"

@injectable()
export default class LandlordRepository implements IRepository<Landlord> {
    findOne(where: FindOptionsWhere<Landlord>): Promise<Landlord | null> {
        return AppDataSource.manager.findOne(Landlord, { where })
    }
    findMany(where: FindOptionsWhere<Landlord>): Promise<Landlord[]> {
        return AppDataSource.manager.find(Landlord, { where })
    }
    create(data: any): Promise<Landlord> {
        const tenant = AppDataSource.manager.save(Landlord, data)
        return tenant
    }
}
