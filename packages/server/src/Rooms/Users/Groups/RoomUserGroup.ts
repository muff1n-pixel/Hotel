import { RoomGroupData, UserGroupData } from "@pixel63/events";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import RoomUser from "../RoomUser";

export default class RoomUserGroup {
    public userGroup: UserGroupModel | null = null;

    constructor(private readonly roomUser: RoomUser) {

    }

    public async refreshUserGroup() {
        if(this.roomUser.room.model.group) {
            const userGroup = await UserGroupModel.findOne({
                where: {
                    userId: this.roomUser.user.model.id,
                    groupId: this.roomUser.room.model.group.id
                }
            });

            this.userGroup = userGroup;

            this.roomUser.user.sendProtobuff(RoomGroupData, this.roomUser.room.group.getGroupData(this.roomUser));
        }
        else {
            this.roomUser.user.sendProtobuff(RoomGroupData, this.roomUser.room.group.getGroupData(this.roomUser));
        }
    }

    public getUserGroupData() {
        if(!this.userGroup) {
            return undefined;
        }

        return UserGroupData.fromJSON(this.userGroup);
    }
}
