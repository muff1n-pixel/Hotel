import { EnterRoomBellQueueData, RoomBellQueueData, RoomBellQueueUserData, UpdateRoomBellQueueData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";

export default class UpdateRoomBellQueueEvent implements ProtobuffListener<UpdateRoomBellQueueData> {
    async handle(user: User, payload: UpdateRoomBellQueueData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const targetUser = game.getUserById(payload.userId);

        if(!targetUser) {
            throw new Error("Target user does not exist.");
        }

        if(targetUser.roomBellQueue?.model.id !== user.room.model.id) {
            throw new Error("Target user is not waiting for this room.");
        }

        targetUser.roomBellQueue = undefined;

        targetUser.sendProtobuff(UpdateRoomBellQueueData, UpdateRoomBellQueueData.create({
            userId: targetUser.model.id,
            accept: payload.accept
        }));

        if(payload.accept) {
            roomUser.room.addUserClient(targetUser);
        }

        for(const roomUserWithRights of roomUser.room.users.filter((user) => user.hasRights())) {
            roomUserWithRights.user.sendProtobuff(RoomBellQueueData, RoomBellQueueData.create({
                users: game.users.filter((user) => user.roomBellQueue?.model.id === roomUserWithRights.room.model.id).map((user) => {
                    return RoomBellQueueUserData.create({
                        id: user.model.id,
                        name: user.model.name
                    })
                })
            }));
        }
    }
}
