import UserClient from "../../../Clients/UserClient.js";
import { eventHandler } from "../../../Events/EventHandler.js";

eventHandler.addListener("RequestUserFurnitureData", async (client: UserClient) => {
    await client.getInventory().sendFurniture();
});
