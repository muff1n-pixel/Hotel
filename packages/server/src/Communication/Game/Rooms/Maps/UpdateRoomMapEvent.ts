import User from "../../../../Users/User.js";
import { randomUUID } from "node:crypto";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { UpdateRoomMapData } from "@pixel63/events";
import { RoomMapModel } from "../../../../Database/Models/Rooms/Maps/RoomMapModel.js";
import GetRoomMapsEvent from "../../Navigator/GetRoomMapsEvent.js";
import { game } from "../../../../index.js";

export default class UpdateRoomMapEvent implements ProtobuffListener<UpdateRoomMapData> {
    async handle(user: User, payload: UpdateRoomMapData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("room:maps")) {
            throw new Error("User is not privileged to edit room maps.");
        }

        if(payload.id !== undefined) {
            await RoomMapModel.update({
                grid: payload.grid,
                door: payload.door,

                index: payload.index
            }, {
                where: {
                    id: payload.id
                }
            });
        }
        else {
            await RoomMapModel.create({
                id: randomUUID(),

                grid: payload.grid,
                door: payload.door,

                index: payload.index,
                indexable: true
            });
        }

        await game.roomNavigatorManager.loadModels();

        await (new GetRoomMapsEvent()).handle(user);
    }
}
