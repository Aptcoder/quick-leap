import { Entity } from "typeorm"
import User from "./user"

@Entity()
export default class Tenant extends User {}
