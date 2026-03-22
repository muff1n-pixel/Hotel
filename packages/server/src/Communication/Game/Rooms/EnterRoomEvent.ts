import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { EnterRoomData, HotelAlertData, RoomLockData } from "@pixel63/events";
import bcrypt from "bcrypt";

export default class EnterRoomEvent implements ProtobuffListener<EnterRoomData> {
    public readonly name = "EnterRoomEvent";

    async handle(user: User, payload: EnterRoomData) {
        if(user.room) {
            const roomUser = user.room.getRoomUser(user);

            roomUser.disconnect();
        }
        
        const roomInstance = await game.roomManager.getOrLoadRoomInstance(payload.id);

        if(!roomInstance) {
            console.error("Room does not exist.");

            return;
        }

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

        roomInstance.addUserClient(user);
    }
}
