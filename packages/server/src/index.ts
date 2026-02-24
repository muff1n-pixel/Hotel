import { initializeModels, recreateShop, resetDatabase } from "./Database/Database";
import { initializeDevelopmentData } from "./Database/Development/DatabaseDevelopmentData";
import Game from "./Game";
import { createMissingFurniture } from "./Database/Development/FurnitureDevelopmentData";
import { recreateShopPages } from "./Database/Development/ShopDevelopmentData";
import InitializerManager from "./Initializer/InitializerManager";

let game: Game;

const startServer = async () => {
    game = new Game();

    await initializeModels();

    if (recreateShop) {
        await recreateShopPages();
    }

    if (process.argv.some((value) => value === "create-furniture")) {
        await createMissingFurniture();
    }

    await game.loadModels();

    await game.hotelInformation.resetUsersOnline();

    console.log("Server started");
}

(async () => {
    if (process.argv.some((value) => value === "--init")) {
        const initializerManager = new InitializerManager();
        return initializerManager.init();
    }

    startServer();
})();

export { startServer, game };