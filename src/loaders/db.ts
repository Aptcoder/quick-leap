import { DataSource } from "typeorm"
import config from "config"

export const initDb = async () => {
    const AppDataSource = new DataSource({
        type: "postgres",
        url: config.get<string>("database_url"),
        logging: false,
        migrations: ["src/migrations/**/*.ts"],
        entities: ["src/**/*.entity.ts"],
        ssl: config.get<boolean>("database.ssl"),
    })

    return AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
            process.exit(1)
        })
}
