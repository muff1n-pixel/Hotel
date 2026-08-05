import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { EnterRoomData, HotelAlertData, RoomLockData } from "@pixel63/events";
import bcrypt from "bcrypt";

export default class EnterRoomEvent implements UserProtobuffListener<EnterRoomData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: EnterRoomData) {
        if(user.room) {
            user.room.disconnect();
        }

        const room = await game.roomServers.getOrCreateRoom(payload.id);
        
        if(!room) {
            console.error("Room does not exist.");

            return;
        }

        /*if(!user.permissions.hasPermission("room:rights")) {
            switch(roomInstance.model.lock) {
                case "invisible": {
                    if(!roomInstance.hasUserVisibility(user.model)) {
                        console.error("User tried to enter a room that is invisible and does not have permission to enter.");

                        return;
                    }

                    break;
                }

                case "bell": {
                    if(roomInstance.model.owner.id === user.model.id) {
                        break;
                    }

                    if(roomInstance.model.rights.some((rights) => rights.user.id === user.model.id)) {
                        break;
                    }

                    user.sendProtobuff(RoomLockData, RoomLockData.create({
                        room: roomInstance.getInformationData()
                    }));

                    return;
                }

                case "password": {
                    if(roomInstance.model.owner.id === user.model.id) {
                        break;
                    }

                    if(roomInstance.model.rights.some((rights) => rights.user.id === user.model.id)) {
                        break;
                    }

                    // TODO: verify password
                    if(!payload.password) {
                        user.sendProtobuff(RoomLockData, RoomLockData.create({
                            room: roomInstance.getInformationData()
                        }));

                        return;
                    }

                    if(!roomInstance.model.password) {
                        return;
                    }

                    if (!(await bcrypt.compare(payload.password, roomInstance.model.password))) {
                        user.sendProtobuff(HotelAlertData, HotelAlertData.create({
                            message: "That password is not correct!",
                            dialogType: "room-password-error"
                        }));
                        
                        return;
                    }
                }
            }
        }*/

        room.addUserToRoom(user, payload.id);
    }
}
