import { CreateRoomEventData } from "@shared/Communications/Requests/Navigator/CreateRoomEventData.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { game } from "../../../index.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { randomUUID } from "node:crypto";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { RoomCreatedEventData } from "@shared/Communications/Responses/Navigator/RoomCreatedEventData.js";

export default class CreateRoomEvent implements IncomingEvent<CreateRoomEventData> {
    async handle(user: User, event: CreateRoomEventData): Promise<void> {
        const map = game.roomNavigatorManager.maps.find((map) => map.id === event.mapId);

        if(!map) {
            throw new Error("Room map model by id does not exist.");
        }

        const room = await RoomModel.create({
            id: randomUUID(),
            name: event.name,

            structure: {
                door: map.door,
                grid: map.grid,
                floor: {
                    id: "default",
                    thickness: 8
                },
                wall: {
                    id: "default",
                    thickness: 8
                }
            }
        });

        user.send(
            new OutgoingEvent<RoomCreatedEventData>("RoomCreatedEvent", {
                success: true,
                roomId: room.id
            })
        );
    }
}
