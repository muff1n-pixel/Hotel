import { initializeModels, recreateShop, resetDatabase, sequelize } from "../Database/Database";
import Game from "./Game";
import { createMissingFurniture } from "../Database/Development/FurnitureDevelopmentData";
import { recreateShopPages } from "../Database/Development/ShopDevelopmentData";
import InitializerManager from "./Initializer/InitializerManager";
import { seedHotelSettings } from "../Database/Models/Hotel/HotelSettingModel";
import { seedAchievements } from "../Database/Models/Achievements/AchievementModel";
import { config } from "./Config/Config";
import { exec, spawn } from "child_process";
import { logger } from "../Room/RoomLogger";

let game: Game;

export async function startServer() {
    game = new Game();

    await initializeModels();

    await sequelize.sync();

    await game.createServerToken();

    await seedAchievements();
    await seedHotelSettings();

    if (recreateShop) {
        await recreateShopPages();
    }

    if (process.argv.some((value) => value === "create-furniture")) {
        await createMissingFurniture();
    }

    await game.loadModels();

    await game.hotelInformation.resetUsersOnline();

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
