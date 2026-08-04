import { RoomEventData } from "@pixel63/events";
import Room from "../Room";

export default class RoomEvent {
    constructor(private readonly room: Room) {

    }

    public async update() {
        await this.room.model.reload();

        for(const roomUser of this.room.users) {
            roomUser.user.sendProtobuff(RoomEventData, this.getEventData());
        }
    }

    public getEventData() {
        if(!this.room.model.eventExpiresAt || new Date().toISOString() >= this.room.model.eventExpiresAt) {
            return RoomEventData.create({
                roomId: this.room.model.id
            });
        }

        return RoomEventData.create({
            roomId: this.room.model.id,
            
            name: this.room.model.eventName ?? this.room.model.name,
            description: this.room.model.eventDescription ?? this.room.model.description,

            categoryId: this.room.model.eventCategoryId,
            expiresAt: this.room.model.eventExpiresAt
        });
    }
}
