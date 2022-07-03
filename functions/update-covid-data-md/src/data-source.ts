import "reflect-metadata"
import { DataSource } from "typeorm"
import { CountryData } from "./entity/CountryData"

const hostport = (process.env.DB_HOST || '127.0.0.1:5432').split(':');
export const AppDataSource = new DataSource({
    type: "postgres",
    host: hostport[0],
    port: parseInt(hostport[1]),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    synchronize: true,
    logging: false,
    entities: [CountryData],
    migrations: [],
    subscribers: [],
})
