import { CreateRoomEventData } from "@shared/Communications/Requests/Navigator/CreateRoomEventData.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { randomUUID } from "node:crypto";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";
import { RoomCreatedData } from "@pixel63/events";

export default class CreateRoomEvent implements IncomingEvent<CreateRoomEventData> {
    public readonly name = "CreateRoomEvent";

    async handle(user: User, event: CreateRoomEventData): Promise<void> {
        const map = game.roomNavigatorManager.maps.find((map) => map.id === event.mapId);

        if(!map) {
            throw new Error("Room map model by id does not exist.");
        }

        const category = await RoomCategoryModel.findOne(
            (event.category)?(
                {
                    where: {
                        id: event.category
                    }
                }
            ):({})
        );

        if(!category) {
            throw new Error("No category was found.");
        }

        if(!(event.maxUsers >= 5 && event.maxUsers <= 50 && event.maxUsers % 5 === 0)) {
            throw new Error("Max users is not an acceptable number.");
        }

        const room = await RoomModel.create({
            id: randomUUID(),
            name: (event.name.length)?(event.name):(`${user.model.name}'s room`),
            
            ownerId: user.model.id,
            categoryId: category.id,
            maxUsers: event.maxUsers,

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
