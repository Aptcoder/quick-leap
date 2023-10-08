import { Entity } from "typeorm"
import User from "./user"

@Entity()
export default class Landlord extends User {}
