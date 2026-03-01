import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { randomUUID } from "node:crypto";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { CreateRoomData, RoomCreatedData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class CreateRoomEvent implements ProtobuffListener<CreateRoomData> {
    async handle(user: User, payload: CreateRoomData): Promise<void> {
        const map = game.roomNavigatorManager.maps.find((map) => map.id === payload.mapId);

        if(!map) {
            throw new Error("Room map model by id does not exist.");
        }

        const category = await RoomCategoryModel.findOne(
            (payload.category)?(
                {
                    where: {
                        id: payload.category
                    }
                }
            ):({})
        );

        if(!category) {
            throw new Error("No category was found.");
        }

        if(!(payload.maxUsers >= 5 && payload.maxUsers <= 50 && payload.maxUsers % 5 === 0)) {
            throw new Error("Max users is not an acceptable number.");
        }

        const room = await RoomModel.create({
            id: randomUUID(),
            name: (payload.name.length)?(payload.name):(`${user.model.name}'s room`),
            
            ownerId: user.model.id,
            categoryId: category.id,
            maxUsers: payload.maxUsers,

            structure: {
                door: map.door,
                grid: map.grid,
                floor: {
                    id: "111",
                    thickness: 8
                },
                wall: {
                    id: "201",
                    thickness: 8,
                    hidden: false
                }
            }
        });

        user.sendProtobuff(RoomCreatedData, RoomCreatedData.create({
            roomId: room.id
        }));
    }
}
