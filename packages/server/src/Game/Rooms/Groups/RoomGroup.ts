import { GroupData, RoomGroupData } from "@pixel63/events";
import Room from "../Room";
import RoomUser from "../Users/RoomUser";

export default class RoomGroup {
    constructor(private readonly room: Room) {

    }

    public async update() {
        await this.room.model.reload();

        for(const roomUser of this.room.users) {
            await roomUser.group.refreshUserGroup();
            
            roomUser.user.sendProtobuff(RoomGroupData, this.getGroupData(roomUser));
        }
    }

    public getGroupData(roomUser: RoomUser) {
        if(!this.room.model.group) {
            return RoomGroupData.create({
                roomId: this.room.model.id
            });
        }

        return RoomGroupData.create({
            roomId: this.room.model.id,

            group: GroupData.fromJSON(this.room.model.group),
            user: roomUser.group.getUserGroupData()
        });
    }
}
