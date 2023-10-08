import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import Landlord from "./landlord.entity"

@Entity()
export default class House {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "int",
        nullable: false,
    })
    price!: number

    @Column({
        type: "varchar",
        nullable: false,
        default: "NGN",
    })
    currency: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    location!: string

    @Column({
        type: "int",
        nullable: false,
    })
    numberOfRooms!: number

    @Column()
    landlordId: string

    @ManyToOne(() => Landlord)
    landlord: Landlord

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    dateJoined!: Date
}
