import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"
import _ from "lodash"
import { inject, injectable } from "inversify"
import { IRepository } from "../common/interfaces/repositories.interface"
import { AuthUserDTO, CreateUserDTO } from "../common/dtos/users.dtos"
import { APIError, ConflictError, NotFoundError } from "../common/errors"
import { Cache } from "cache-manager"
import User from "src/entities/user.entity"

@injectable()
export default class UserService {
    constructor(
        @inject("user_repository")
        private readonly userRepo: IRepository<User>,
        @inject("cache_service") private cache: Cache
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async createUser(
        createUserDto: CreateUserDTO
    ): Promise<Omit<User, "password">> {
        const existingUser = await this.userRepo.findOne({
            email: createUserDto.email,
        })
        if (existingUser) {
            throw new ConflictError("User with this email already exists")
        }
        const hashedPassword = await this.hashPassword(createUserDto.password)
        const user = await this.userRepo.create({
            ...createUserDto,
            password: hashedPassword,
        })

        return _.omit(user, "password")
    }
    public async auth(
        authUserDto: AuthUserDTO
    ): Promise<{ accessToken: string; user: Omit<User, "password"> }> {
        const { email: userEmail, password: userPassword } = authUserDto
        let user = await this.userRepo.findOne({
            email: userEmail,
        })

        if (!user) {
            throw new NotFoundError("User not found")
        }

        const comparePasswordResult = await this.comparePassword(
            userPassword,
            user.password!
        )
        if (!comparePasswordResult) {
            throw new APIError("Invalid password", 401)
        }

        const { accessToken } = await this.generateToken(user)
        const userWithoutPassword = _.omit(user, "password")

        await this.cache.set(accessToken, user.id, 60 * 60 * 1000)

        return { accessToken, user: userWithoutPassword }
    }

    public async comparePassword(inputPass: string, password: string) {
        return bcrypt.compare(inputPass, password)
    }

    public async generateToken(user: User): Promise<{ accessToken: string }> {
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

    async getUsers(): Promise<User[]> {
        return this.userRepo.findMany({})
    }

    async getUser(userId: string): Promise<User | null> {
        const user = await this.userRepo.findOne({
            id: userId,
        })

        if (!user) {
            throw new NotFoundError("User not found")
        }
        return user
    }
}
