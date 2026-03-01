import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { UpdateUserRightsEventData } from "@shared/Communications/Requests/Rooms/User/UpdateUserRightsEventData.js";
import { RoomRightsModel } from "../../../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { randomUUID } from "node:crypto";
import { RoomUserData } from "@pixel63/events";

export default class UpdateUserRightsEvent implements IncomingEvent<UpdateUserRightsEventData> {
    public readonly name = "UpdateUserRightsEvent";

    async handle(user: User, event: UpdateUserRightsEventData) {
        if(!user.room) {
            return;
        }

        if(user.room.model.owner.id !== user.model.id) {
            throw new Error("User is not room owner.");
        }

        const targetUser = user.room.getRoomUserById(event.userId);

        if(user.room.model.owner.id === targetUser.user.model.id) {
            throw new Error("Target user is room owner.");
        }

        if(event.hasRights && !targetUser.hasRights()) {
            const rights = await RoomRightsModel.create({
                id: randomUUID(),
                roomId: user.room.model.id,
                userId: targetUser.user.model.id
            });

            rights.room = user.room.model;
            rights.user = targetUser.user.model;

            user.room.model.rights.push(rights);
        }
        else if(!event.hasRights && targetUser.hasRights()) {
            const rights = user.room.model.rights.find((rights) => rights.user.id === targetUser.user.model.id);

            if(!rights) {
                throw new Error("User does not have rights.");
            }

            await rights.destroy();

            user.room.model.rights.splice(user.room.model.rights.indexOf(rights), 1);
        }
        else {
            console.debug("User already has equivalent rights.");

            return;
        }

        user.room.sendProtobuff(RoomUserData, RoomUserData.create({
            id: targetUser.user.model.id,
            hasRights: targetUser.hasRights()
        }));
    }
}
