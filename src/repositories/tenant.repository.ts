import { injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import Tenant from "../entities/tenant.entity"
import { AppDataSource } from "../loaders/db"
import { FindOptionsWhere } from "typeorm"

@injectable()
export default class TenantRepository implements IRepository<Tenant> {
    findOne(where: FindOptionsWhere<Tenant>): Promise<Tenant | null> {
        return AppDataSource.manager.findOne(Tenant, { where })
    }
    findMany(where: FindOptionsWhere<Tenant>): Promise<Tenant[]> {
        return AppDataSource.manager.find(Tenant, { where })
    }
    create(data: any): Promise<Tenant> {
        const tenant = AppDataSource.manager.save(Tenant, data)
        return tenant
    }
}
