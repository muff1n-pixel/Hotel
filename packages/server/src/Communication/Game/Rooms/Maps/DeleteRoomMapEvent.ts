import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { DeleteRoomMapData } from "@pixel63/events";
import { RoomMapModel } from "../../../../Database/Models/Rooms/Maps/RoomMapModel.js";
import GetRoomMapsEvent from "../../Navigator/GetRoomMapsEvent.js";
import { game } from "../../../../index.js";

export default class DeleteRoomMapEvent implements ProtobuffListener<DeleteRoomMapData> {
    async handle(user: User, payload: DeleteRoomMapData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("room:maps")) {
            throw new Error("User is not privileged to edit room maps.");
        }

        const roomMap = await RoomMapModel.findByPk(payload.id);

        if(!roomMap) {
            throw new Error("Room map does not exist.");
        }

        await roomMap.update({
            indexable: false
        });

        await game.roomNavigatorManager.loadModels();

        await (new GetRoomMapsEvent()).handle(user);
    }
}
