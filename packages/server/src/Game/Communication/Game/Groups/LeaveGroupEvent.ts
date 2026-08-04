import { LeaveGroupData, GetUserGroupData, RoomGroupData, GetGroupData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import GetUserGroupEvent from "./GetUserGroupEvent";
import GetGroupEvent from "./GetGroupEvent";

export default class LeaveGroupEvent implements ProtobuffListener<LeaveGroupData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: LeaveGroupData): Promise<void> {
        const group = await GroupModel.findByPk(payload.groupId);

        if(!group) {
            throw new Error("Group does not exist.");
        }

        const userGroup = await UserGroupModel.findOne({
            where: {
                groupId: group.id,
                userId: user.model.id
            }
        });

        if(!userGroup) {
            throw new Error("User is not a group member.");
        }

        if(userGroup.owner) {
            throw new Error("User is owner of group.");
        }

        await userGroup.destroy();

        await new GetGroupEvent().handle(user, GetGroupData.create({
            id: group.id
        }));

        await new GetUserGroupEvent().handle(user, GetUserGroupData.create({
            id: group.id
        }));
    }
}
