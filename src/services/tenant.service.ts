import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"
import Tenant from "src/entities/tenant.entity"
import { inject, injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import { AuthTenantDTO, CreateTenantDTO } from "../common/dtos/users.dtos"
import { ITenantService } from "../common/interfaces/services.interface"
import { APIError, ConflictError, NotFoundError } from "../common/errors"

@injectable()
export default class TenantService {
    constructor(
        @inject("tenant_repository")
        private readonly tenantRepo: IRepository<Tenant>
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async createTenant(
        createTenantDto: CreateTenantDTO
    ): Promise<Omit<Tenant, "password">> {
        const existingTenant = await this.tenantRepo.findOne({
            email: createTenantDto.email,
        })
        if (existingTenant) {
            throw new ConflictError("Tenant with this email already exists")
        }
        const hashedPassword = await this.hashPassword(createTenantDto.password)
        const tenant = await this.tenantRepo.create({
            ...createTenantDto,
            password: hashedPassword,
        })

        return _.omit(tenant, "password")
    }
    public async auth(
        authTenantDto: AuthTenantDTO
    ): Promise<{ accessToken: string; tenant: Omit<Tenant, "password"> }> {
        const { email: userEmail, password: userPassword } = authTenantDto
        let tenant = await this.tenantRepo.findOne({
            email: userEmail,
        })

        if (!tenant) {
            throw new NotFoundError("User not found")
        }

        const comparePasswordResult = await this.comparePassword(
            userPassword,
            tenant.password!
        )
        if (!comparePasswordResult) {
            throw new APIError("Invalid password", 401)
        }

        const { accessToken } = await this.generateToken(tenant)
        const userWithoutPassword = _.omit(tenant, "password")

        return { accessToken, tenant: userWithoutPassword }
    }

    public async comparePassword(inputPass: string, password: string) {
        return bcrypt.compare(inputPass, password)
    }

    public async generateToken(user: Tenant): Promise<{ accessToken: string }> {
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

    async getTenants(): Promise<Tenant[]> {
        return this.tenantRepo.findMany({})
    }
}
