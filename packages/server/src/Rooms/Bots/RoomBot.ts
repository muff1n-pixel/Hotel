import Room from "../Room.js";
import { UserBotModel } from "../../Database/Models/Users/Bots/UserBotModel.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { game } from "../../index.js";
import { RoomBotEventData } from "@shared/Communications/Responses/Rooms/Bots/RoomBotEventData.js";
import { UserBotData } from "@shared/Interfaces/Room/RoomBotData.js";

export default class RoomBot {
    public preoccupiedByActionHandler: boolean = false;

    constructor(public readonly room: Room, public readonly model: UserBotModel) {
    }

    public static async place(room: Room, userBot: UserBotModel, position: RoomPosition, direction: number) {
        await userBot.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomBot = new RoomBot(room, userBot);

        room.bots.push(roomBot);

        room.floorplan.updatePosition(position);

        room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
            botAdded: [
                roomBot.getBotData()
            ]
        }));

        return roomBot;
    }

    public getBotData(): UserBotData {
        return {
            id: this.model.id,
            userId: this.model.user.id,
            
            position: this.model.position,
            direction: this.model.direction,

            type: this.model.type,

            name: this.model.name,
            motto: this.model.motto,

            figureConfiguration: this.model.figureConfiguration,
        };
    }

    public async pickup() {
        this.room.bots.splice(this.room.bots.indexOf(this), 1);

        this.room.floorplan.updatePosition(this.model.position);

        this.room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
            botRemoved: [
                {
                    id: this.model.id
                }
            ]
        }));

        await this.model.update({
            roomId: null
        });

        const user = game.getUserById(this.model.user.id);

        if(user) {
            user.getInventory().addBot(this.model);
        }
    }

    public async setPosition(position: RoomPosition, save: boolean = true) {
        const previousPosition = this.model.position;

        this.model.position = position;

        this.room.floorplan.updatePosition(position, previousPosition);

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
                botUpdated: [
                    this.getBotData()
                ]
            }));
        }
    }
}
