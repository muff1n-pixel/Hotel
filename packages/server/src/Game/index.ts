import { initializeModels, recreateShop, resetDatabase, sequelize } from "../Database/Database";
import Game from "./Game";
import { createMissingFurniture } from "../Database/Development/FurnitureDevelopmentData";
import { recreateShopPages } from "../Database/Development/ShopDevelopmentData";
import InitializerManager from "./Initializer/InitializerManager";
import { seedHotelSettings } from "../Database/Models/Hotel/HotelSettingModel";
import { seedAchievements } from "../Database/Models/Achievements/AchievementModel";
import { config } from "./Config/Config";
import { exec, spawn } from "child_process";
import { logger } from "./GameLogger";

let game: Game;

export async function startServer() {
    game = new Game();

    logger.verbose("Initializing models...");

    await initializeModels();

    logger.verbose("Synchronizing database...");

    await sequelize.sync();

    logger.verbose("Creating server token...");

    await game.createServerToken();

    logger.verbose("Seeding achievements...");

    await seedAchievements();

    logger.verbose("Seeding hotel settings...");
    await seedHotelSettings();

    if (recreateShop) {
        await recreateShopPages();
    }

    if (process.argv.some((value) => value === "create-furniture")) {
        await createMissingFurniture();
    }

    logger.verbose("Loading models...");
    await game.loadModels();

    await game.hotelInformation.resetUsersOnline();

    logger.verbose("Loading room servers...");

    if(config.rooms.automaticallySpawnRoomServers) {
        for(const port of config.rooms.automaticRoomServerPortAllocations) {
            logger.info(`Spawning room server process at port ${port}.`);

            const child = exec(`npm run room -- --port=${port}`);
            
            child.stdout?.pipe(process.stdout);
            child.stderr?.pipe(process.stderr);
        }
    }

    game.webSocket.ready = true;

    console.log("Server started");
}

(async () => {
    if (process.argv.some((value) => value === "--init")) {
        const initializerManager = new InitializerManager();
        return initializerManager.init();
    }

    await startServer();
})().catch(console.error);

export { game };
