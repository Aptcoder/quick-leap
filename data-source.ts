import { DataSource } from "typeorm"
import config from "config"

export const dataSource = new DataSource({
    type: "postgres",
    url: config.get<string>("database_url"),
    logging: false,
    migrations: ["src/migrations/**/*.ts"],
    entities: ["src/**/*.entity.ts"],
    ssl: config.get<boolean>("database.ssl"),
})
