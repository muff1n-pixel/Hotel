import express from 'express';
import { Sequelize } from 'sequelize';
import { readFileSync } from 'fs';
import path from 'path';
import cookieParser from "cookie-parser";
import type { Config } from './Interfaces/Config.ts';
import { sendCriticalError, sendLog } from "@shared/Logger/Logger";
import { ModelManager } from './Models/ModelManager.ts';
import { ApiManager } from './Api/ApiManager.ts';

class App {
    config: Config | null;
    modelManager: ModelManager;
    apiManager: ApiManager;
    sequelize: Sequelize | null;
    expressApp: express.Application;

    constructor() {
        this.config = null;
        this.modelManager = new ModelManager();
        this.apiManager = new ApiManager();
        this.sequelize = null;
        this.expressApp = express();
    }

    async init() {
        console.log("  _____ _          _   __ ____  \r\n |  __ (_)        | | \/ \/|___ \\ \r\n | |__) |__  _____| |\/ \/_  __) |\r\n |  ___\/ \\ \\\/ \/ _ \\ | \'_ \\|__ < \r\n | |   | |>  <  __\/ | (_) |__) |\r\n |_|   |_\/_\/\\_\\___|_|\\___\/____\/ \r\n");
        sendLog("INFO", "Initializing web server...");

        this.config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" }));

        if (!this.config)
            return sendCriticalError("Failed to load config.json");

        this.sequelize = new Sequelize(this.config.database);
        const modelsLoaded = await this.modelManager.init(this.sequelize);
        sendLog("INFO", `${modelsLoaded} models loaded.`);

        this.expressApp.use(express.json());
        this.expressApp.use(cookieParser());
        const apiRoutesLoaded = await this.apiManager.init(this.expressApp);
        sendLog("INFO", `${apiRoutesLoaded} API routes loaded.`);

        this.expressApp.use(express.static(path.join(this.config.static, "web")));

        this.expressApp.use("/game", express.static(path.join(this.config.static, "game")));
        this.expressApp.use("/game/assets", express.static(this.config.assets));
        this.expressApp.use("/assets", express.static(this.config.assets));

        this.expressApp.get('/game/config.json', (request, response) => {
            return response.json(this.config?.public);
        });

        this.expressApp.get('/discord', (request, response) => {
            if (this.config?.public.discord) {
                return response.redirect(this.config.public.discord);
            }

            return response.redirect("/404");
        });

        this.expressApp.get('/{*any}', (req, res) => res.sendFile("index.html", {
            root: path.join((this.config as Config).static, "web")
        }));

        this.expressApp.listen(this.config.port);
    }
}

const Server = new App;
Server.init()
    .then(() => sendLog("SUCCESS", `Web server listening on port ${Server.config?.port}`))
    .catch((error: string) => { sendCriticalError(error) });
export default Server;