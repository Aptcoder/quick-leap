import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"
import Tenant from "src/entities/tenant.entity"
import { inject, injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import { AuthLandlordDTO, CreateLandlordDTO } from "../common/dtos/users.dtos"
import { ILandlordService } from "../common/interfaces/services.interface"
import { APIError, ConflictError, NotFoundError } from "../common/errors"
import Landlord from "../entities/landlord.entity"
import House from "../entities/house.entity"
import { CreateHouseDTO } from "../common/dtos/house.dtos"

@injectable()
export default class HouseService {
    constructor(
        @inject("house_repository")
        private readonly houseRepo: IRepository<House>
    ) {}

    async createHouse(
        createHouseDto: CreateHouseDTO,
        landlordId: string
    ): Promise<House> {
        const house = await this.houseRepo.create({
            ...createHouseDto,
            landlordId,
        })

        return house
    }

    async getHouses(): Promise<House[]> {
        return this.houseRepo.findMany({})
    }
}
