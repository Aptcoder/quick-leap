import { injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import { AppDataSource } from "../loaders/db"
import { FindOptionsWhere } from "typeorm"
import House from "../entities/house.entity"

@injectable()
export default class HouseRepository implements IRepository<House> {
    findOne(where: FindOptionsWhere<House>): Promise<House | null> {
        return AppDataSource.manager.findOne(House, { where })
    }
    findMany(where: FindOptionsWhere<House>): Promise<House[]> {
        return AppDataSource.manager.find(House, { where })
    }
    create(data: any): Promise<House> {
        const house = AppDataSource.manager.save(House, data)
        return house
    }
}
