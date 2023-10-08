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

@injectable()
export default class LandlordService {
    constructor(
        @inject("landlord_repository")
        private readonly landlordRepo: IRepository<Landlord>
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async createLandlord(
        createLandlordDto: CreateLandlordDTO
    ): Promise<Omit<Landlord, "password">> {
        const existingLandlord = await this.landlordRepo.findOne({
            email: createLandlordDto.email,
        })
        if (existingLandlord) {
            throw new ConflictError("Landlord with this email already exists")
        }
        const hashedPassword = await this.hashPassword(
            createLandlordDto.password
        )
        const landlord = await this.landlordRepo.create({
            ...createLandlordDto,
            password: hashedPassword,
        })

        return _.omit(landlord, "password")
    }

    public async auth(
        authLandlordDto: AuthLandlordDTO
    ): Promise<{ accessToken: string; landlord: Omit<Landlord, "password"> }> {
        const { email: userEmail, password: userPassword } = authLandlordDto
        let landlord = await this.landlordRepo.findOne({
            email: userEmail,
        })

        if (!landlord) {
            throw new NotFoundError("User not found")
        }

        const comparePasswordResult = await this.comparePassword(
            userPassword,
            landlord.password!
        )
        if (!comparePasswordResult) {
            throw new APIError("Invalid password", 401)
        }

        const { accessToken } = await this.generateToken(landlord)
        const userWithoutPassword = _.omit(landlord, "password")

        return { accessToken, landlord: userWithoutPassword }
    }

    public async comparePassword(inputPass: string, password: string) {
        return bcrypt.compare(inputPass, password)
    }

    public async generateToken(
        user: Landlord
    ): Promise<{ accessToken: string }> {
        const payload = {
            email: user.email,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
        }
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                config.get<string>("jwtSecret"),
                {
                    // expiresIn: '600000'
                    expiresIn: "18000000",
                },
                (err: any, token) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve({ accessToken: token as string })
                }
            )
        })
    }

    async getLandlords(): Promise<Tenant[]> {
        return this.landlordRepo.findMany({})
    }
}
