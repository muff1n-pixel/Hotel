import { ServerProtobuffListener } from "../Interfaces/ServerProtobuffListener";
import RoomServer from "../../RoomServer";
import { ServerUserInventoryUpdatedData, ServerUserPlaceFurnitureInRoomData } from "@pixel63/events";
import RoomFurniture from "../../Rooms/Furniture/RoomFurniture";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel";
import { FurnitureCrackableModel } from "../../../Database/Models/Furniture/Crackable/FurnitureCrackableModel";
import { UserModel } from "../../../Database/Models/Users/UserModel";

export default class ServerUserPlaceFurnitureInRoomEvent implements ServerProtobuffListener<ServerUserPlaceFurnitureInRoomData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(_: null, payload: ServerUserPlaceFurnitureInRoomData) {
        const user = RoomServer.users.find((user) => user.model.id === payload.userId);

        if(!user) {
            throw new Error("User is not connected.");
        }

        const userFurniture = await UserFurnitureModel.findByPk(payload.userFurnitureId, {
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture",

                    include: [
                        {
                            model: FurnitureCrackableModel,
                            as: "crackable"
                        }
                    ]
                },
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });

        if(!userFurniture) {
            throw new Error("User furniture does not exist.");
        }

        if(!user.roomUser.hasRights() || !payload.position) {
            RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
                userId: payload.userId,
                furnitureAdded: [payload.userFurnitureId]
            }));
        }
        else {
            await RoomFurniture.place(user.room, userFurniture, payload.position, payload.direction);
        }
    }
}
