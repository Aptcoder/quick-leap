import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    firstName!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    lastName!: string

    @Column({
        type: "varchar",
        nullable: false,
    })
    password!: string

    @Column({
        type: "boolean",
        default: false,
        nullable: false,
    })
    verified: boolean

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
        transformer: {
            to: (value: string) => value.toLowerCase(),
            from: (value) => value,
        },
    })
    email!: string

    @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    dateJoined!: Date
}
