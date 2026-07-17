import { GetUserRoomsData, UserRoomsData } from "@pixel63/events";
import { RoomModel } from "../../../../Database/Models/Rooms/RoomModel.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import User from "../../../../Users/User.js";

export default class GetUserRoomsEvent implements ProtobuffListener<GetUserRoomsData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User) {
        const rooms = await RoomModel.findAll({
            where: {
                ownerId: user.model.id
            }
        });

        user.sendProtobuff(UserRoomsData, UserRoomsData.create({
            rooms: rooms.map((room) => {
                return {
                    id: room.id,
                    name: room.name,
                    groupId: room.groupId
                };
            })
        }));
    }
}
