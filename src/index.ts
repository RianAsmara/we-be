import "reflect-metadata"
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { InMemoryUserRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";
import { UserHandler } from "./handlers/userHandler";
import { FolderRepository } from "./repositories/folder.repository";
import { FolderService } from "./services/folder.service";
import { folderHandler } from "./handlers/folder.handler";
import { AppDataSource } from "./config/database";
import swagger from "@elysiajs/swagger";

// Initialize TypeORM
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// Initialize repositories
const userRepository = new InMemoryUserRepository();
const folderRepository = new FolderRepository(AppDataSource);

// Initialize services
const userService = new UserService(userRepository);
const folderService = new FolderService(folderRepository);

// Initialize handlers
const userHandler = new UserHandler(userService);

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "Explorer API",
        description: "API for explorer",
        version: "1.0.0"
      },
    }
  }))
  // Register user routes
  .use(userHandler.registerRoutes)
  // Register folder routes
  .use(folderHandler(folderService));

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
