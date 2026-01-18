import { FurnitureModel } from "../Database/Models/Furniture/FurnitureModel.js";
import { RoomModel } from "../Database/Models/Rooms/RoomModel.js";
import { RoomFurnitureModel } from "../Database/Models/Rooms/RoomFurnitureModel.js";
import RoomInstance from "./RoomInstance.js";

// TODO: do we really need the Room model in the functions or is it sufficient with a roomId?
export default class RoomManager {
    public static instances: RoomInstance[] = [];

    public static getOrLoadRoomInstance(roomId: string) {
        return this.getRoomInstance(roomId) ?? this.loadRoomInstance(roomId);
    }

    public static getRoomInstance(roomId: string) {
        const instance = this.instances.find((instance) => instance.room.id === roomId);

        if(!instance) {
            return null;
        }

        return instance;
    }

    public static async loadRoomInstance(roomId: string) {
        const room = await RoomModel.findByPk(roomId, {
            include: {
                model: RoomFurnitureModel,
                as: "roomFurnitures",
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            }
        });

        if(!room) {
            return null;
        }

        const instance = new RoomInstance(room);

        this.instances.push(instance);

        return instance;
    }
}
