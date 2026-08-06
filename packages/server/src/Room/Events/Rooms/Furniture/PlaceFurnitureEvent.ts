import RoomFurniture from "../../../Rooms/Furniture/RoomFurniture.js";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { PlaceRoomFurnitureData, ServerUserInventoryUpdatedData, WidgetNotificationData } from "@pixel63/events";
import { randomUUID } from "crypto";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import User from "../../../Users/User.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import RoomServer from "../../../RoomServer.js";

export default class PlaceFurnitureEvent implements RoomProtobuffListener<PlaceRoomFurnitureData> {
    async handle(user: User, payload: PlaceRoomFurnitureData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const userFurniture = await UserFurnitureModel.findOne({
            where: {
                ...((payload.stackable)?({
                    furnitureId: payload.furnitureId,
                }):({
                    id: payload.id,
                })),
                userId: user.id,
                roomId: null,
                traxId: null,
                giftId: null
            },
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture"
                },
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });

        if(!userFurniture) {
            throw new Error("User does not have a user furniture by this id.");
        }

        if(userFurniture.furniture.placement === "floor") {
            if(user.roomUser.room.floorFurnitureCount >= RoomServer.hotelSettings.roomMaxFloorFurniture) {
                user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `Maximum floor furniture count has been reached!`
                }));

                return;
            }
        }
        else {
            if(user.roomUser.room.wallFurnitureCount >= RoomServer.hotelSettings.roomMaxWallFurniture) {
                user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `Maximum wall furniture count has been reached!`
                }));

                return;
            }
        }

        if(!payload.position) {
            throw new Error();
        }

        if(userFurniture.furniture.category === "teleport") {
            await userFurniture.update({
                animation: 0
            });
        }

        await RoomFurniture.place(user.roomUser.room, userFurniture, payload.position, payload.direction);

        RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
            userId: user.id,
            furnitureRemoved: [userFurniture.id]
        }));
    }
}
