import { initializeModels, recreateShop } from "./Database/Database.js";
import Game from "./Workers/Game.js";
import { createMissingFurniture } from "./Database/Development/FurnitureDevelopmentData.js";
import { recreateShopPages } from "./Database/Development/ShopDevelopmentData.js";
import InitializerManager from "./Initializer/InitializerManager.js";

let game: Game;

export async function startServer() {
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

export { game };
