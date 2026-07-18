import { GroupData, RoomGroupData } from "@pixel63/events";
import Room from "../Room";

export default class RoomGroup {
    constructor(private readonly room: Room) {

    }

    public getGroupData() {
        if(!this.room.model.group) {
            return RoomGroupData.create({
                roomId: this.room.model.id
            });
        }

        return RoomGroupData.create({
            roomId: this.room.model.id,

            group: GroupData.create({
                id: this.room.model.group.id,
                
                name: this.room.model.group.name,
                description: this.room.model.group.description,
                
                primaryColor: this.room.model.group.primaryColor,
                secondaryColor: this.room.model.group.secondaryColor,

                badge: this.room.model.group.badge,
            })
        });
    }
}
