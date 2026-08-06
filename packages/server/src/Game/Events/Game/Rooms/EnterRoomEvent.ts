import { RoomRightsModel } from "../../../../Database/Models/Rooms/Rights/RoomRightsModel.js";
import { RoomModel } from "../../../../Database/Models/Rooms/RoomModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
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

        const roomModel = await RoomModel.scope({ method: [ 'withVisibility', user.model.id ] }).findByPk(payload.id, {
            include: [
                {
                    model: RoomRightsModel,
                    as: "rights",
                    include: [
                        {
                            model: UserModel,
                            as: "user"
                        }
                    ]
                },
            ]
        });

        if(!roomModel) {
            throw new Error("Room model doesn't exist or user can not see it.");
        }

        if(!user.permissions.hasPermission("room:rights")) {
            switch(roomModel.lock) {
                case "bell": {
                    if(roomModel.owner.id === user.model.id) {
                        break;
                    }

                    if(roomModel.rights.some((rights) => rights.user.id === user.model.id)) {
                        break;
                    }

                    /*user.sendProtobuff(RoomLockData, RoomLockData.create({
                        room: roomInstance.getInformationData()
                    }));*/

                    return;
                }

                case "password": {
                    if(roomModel.owner.id === user.model.id) {
                        break;
                    }

                    if(roomModel.rights.some((rights) => rights.user.id === user.model.id)) {
                        break;
                    }

                    if(!payload.password) {
                        /*user.sendProtobuff(RoomLockData, RoomLockData.create({
                            room: roomInstance.getInformationData()
                        }));*/

                        return;
                    }

                    if(!roomModel.password) {
                        return;
                    }

                    if (!(await bcrypt.compare(payload.password, roomModel.password))) {
                        user.sendProtobuff(HotelAlertData, HotelAlertData.create({
                            message: "That password is not correct!",
                            dialogType: "room-password-error"
                        }));
                        
                        return;
                    }
                }
            }
        }

        const room = await game.roomWorkerPool.getOrCreateRoom(payload.id);
        
        if(!room) {
            console.error("Room does not exist.");

            return;
        }

        room.addUserToRoom(user, payload.id);
    }
}
