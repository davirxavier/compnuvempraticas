import "reflect-metadata"
import { DataSource } from "typeorm"
import { Answer } from "./entity/Answer"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DBHOST || '127.0.0.1',
    port: 5432,
    username: process.env.DBUSER || 'postgres',
    password: process.env.DBPASS || 'postgres',
    database: process.env.DBNAME || 'postgres',
    synchronize: true,
    logging: false,
    entities: [Answer],
    migrations: [],
    subscribers: [],
})
