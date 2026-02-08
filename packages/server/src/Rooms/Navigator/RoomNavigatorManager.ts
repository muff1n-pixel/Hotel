import { CreateRoomEventData } from "@shared/Communications/Requests/Navigator/CreateRoomEventData.js";
import { RoomMapModel } from "../../Database/Models/Rooms/Maps/RoomMapModel.js";
import { eventHandler } from "../../Events/EventHandler.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import User from "../../Users/User.js";
import { RoomMapsEventData } from "@shared/Communications/Responses/Navigator/RoomMapsEventData.js";
import { RoomModel } from "../../Database/Models/Rooms/RoomModel.js";
import { randomUUID } from "crypto";
import { RoomCreatedEventData } from "@shared/Communications/Responses/Navigator/RoomCreatedEventData.js";

export default class RoomNavigatorManager {
    public maps: RoomMapModel[] = [];

    constructor() {
        eventHandler.addListener("RoomMapsRequest", this.onRoomMapsRequest.bind(this));
    }

    public async loadModels() {
        this.maps = await RoomMapModel.findAll({
            where: {
                indexable: true
            },
            order: [
                ["index", "ASC"]
            ]
        });
    }

    private async onRoomMapsRequest(user: User) {
        user.send(
            new OutgoingEvent<RoomMapsEventData>("RoomMapsEvent", this.maps.map((map) => map.toJSON()))
        );
    }
}
