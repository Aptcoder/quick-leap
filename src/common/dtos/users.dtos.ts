import { IsEmail, IsString, IsStrongPassword } from "class-validator"
export class CreateUserDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string

    @IsString()
    firstName!: string

    @IsString()
    lastName!: string
}

export class AuthUserDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string
}

export class VerifyTokenDTO {
    @IsString()
    token: string
}
