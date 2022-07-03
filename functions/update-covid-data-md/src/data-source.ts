import "reflect-metadata"
import { DataSource } from "typeorm"
import { CountryData } from "./entity/CountryData"
require('dotenv').config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || '127.0.0.1',
    port: 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    synchronize: true,
    logging: false,
    entities: [CountryData],
    migrations: [],
    subscribers: [],
})
