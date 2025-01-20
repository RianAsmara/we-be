import { DataSource } from "typeorm"
import { User } from "../entities/User"
import { File } from "../entities/File"
import { Folder } from "../entities/Folder"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.TYPEORM_HOST || "localhost",
    port: parseInt(process.env.TYPEORM_PORT || "5432"),
    username: process.env.TYPEORM_USERNAME || "postgres",
    password: process.env.TYPEORM_PASSWORD || "postgres",
    database: process.env.TYPEORM_DATABASE || "explorer_db",
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
    logging: process.env.TYPEORM_LOGGING === "true",
    entities: [User, File, Folder],
    subscribers: [],
    migrations: [],
})
