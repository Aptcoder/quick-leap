import { Application } from "express"
import { initContainer } from "../../src/loaders/container"
import {
    dropDatabase,
    prepareSeederFactories,
    setDataSource,
    useDataSource,
} from "typeorm-extension"
import { AppDataSource } from "../../src/loaders/db"

export async function setupForTests({
    expressApp,
}: {
    expressApp: Application
}) {
    const Container = await initContainer()
    return Container
}

export async function setupDb() {
    setDataSource(AppDataSource, "app_datasource")
    const ds = await useDataSource("app_datasource")
    await ds.dropDatabase()
    await ds.runMigrations()

    // prepareSeederFactories([userFactory])

    return ds
}
