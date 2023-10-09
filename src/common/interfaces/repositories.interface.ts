import { FindOptionsWhere } from "typeorm"

export interface IRepository<T> {
    findOne(where: FindOptionsWhere<T>): Promise<T | null>
    findMany(where: FindOptionsWhere<T>): Promise<T[]>
    create(data: any): Promise<T>
    update(criteria: Partial<T>, update: Partial<T>): Promise<any>
}
