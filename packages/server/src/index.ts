import { initializeModels, recreateShop, resetDatabase } from "./Database/Database";
import Game from "./Game";
import { createMissingFurniture } from "./Database/Development/FurnitureDevelopmentData";
import { recreateShopPages } from "./Database/Development/ShopDevelopmentData";
import InitializerManager from "./Initializer/InitializerManager";
import { config } from "./Config/Config";
import { PermissionModel } from "./Database/Models/Permissions/PermissionModel";
import { PermissionRoleModel } from "./Database/Models/Permissions/PermissionRoleModel";

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

    await startServer();
})().catch(console.error);

export { game };
