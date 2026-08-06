import { ServerRoomData, ServerUserInventoryRefreshData, ServerUserInventoryUpdatedData, UserInventoryFurnitureCollectionData, UserInventoryFurnitureData } from "@pixel63/events";
import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomWorkerWebSocket from "../../Rooms/RoomWorkerWebSocket";
import { game } from "../..";
import User from "../../Users/User";
import UserInventory from "../../Users/Inventory/UserInventory";
import RoomWorker from "../../Rooms/RoomWorker";

export default class ServerUserInventoryRefreshEvent implements ServerProtobuffListener<ServerUserInventoryRefreshData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(client: RoomWorker, payload: ServerUserInventoryRefreshData) {
        const user = game.getUserById(payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }

        const inventory = user.getInventory();

        await this.handleFurniture(user, inventory, payload);
        await this.handlePets(user, inventory, payload);
        await this.handleBots(user, inventory, payload);
    }

    private async handleFurniture(user: User, inventory: UserInventory, payload: ServerUserInventoryRefreshData) {
        if(payload.furniture) {
            inventory.sendFurniture(payload.trading, payload.furnitureIdsInTrade);
        }
    }
    
    private async handlePets(user: User, inventory: UserInventory, payload: ServerUserInventoryRefreshData) {
        if(payload.pets) {
            inventory.sendPets();
        }
    }
    
    private async handleBots(user: User, inventory: UserInventory, payload: ServerUserInventoryRefreshData) {
        if(payload.bots) {
            inventory.sendBots();
        }
    }
}
