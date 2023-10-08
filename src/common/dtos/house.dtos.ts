import { IsEmail, IsInt, IsString, IsStrongPassword } from "class-validator"
export class CreateHouseDTO {
    @IsInt()
    price: number

    @IsString()
    location!: string

    @IsInt()
    numberOfRooms: number
}
