import { IsEmail, IsString, IsStrongPassword } from "class-validator"
class CreateUserDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string

    @IsString()
    firstName!: string

    @IsString()
    lastName!: string
}

class AuthUserDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string
}

export class CreateTenantDTO extends CreateUserDTO {}
export class CreateLandlordDTO extends CreateUserDTO {}

export class AuthTenantDTO extends AuthUserDTO {}
export class AuthLandlordDTO extends AuthUserDTO {}
