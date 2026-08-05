import { initializeModels, recreateShop, resetDatabase, sequelize } from "../Database/Database";
import Game from "./Game";
import { createMissingFurniture } from "../Database/Development/FurnitureDevelopmentData";
import { recreateShopPages } from "../Database/Development/ShopDevelopmentData";
import InitializerManager from "./Initializer/InitializerManager";
import { seedHotelSettings } from "../Database/Models/Hotel/HotelSettingModel";
import { seedAchievements } from "../Database/Models/Achievements/AchievementModel";

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

    game.roomServers.addServer("localhost", 8081);

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
