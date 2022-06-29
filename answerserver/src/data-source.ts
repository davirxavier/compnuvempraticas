import "reflect-metadata"
import { DataSource } from "typeorm"
import { Answer } from "./entity/Answer"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DBHOST,
    port: 5432,
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    synchronize: true,
    logging: false,
    entities: [Answer],
    migrations: [],
    subscribers: [],
})
