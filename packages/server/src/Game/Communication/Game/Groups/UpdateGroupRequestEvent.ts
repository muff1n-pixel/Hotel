import { UpdateGroupRequestData, GroupData, GetGroupData, GetUserGroupData, RoomGroupData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel, GroupType } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel";
import { UserModel } from "../../../Database/Models/Users/UserModel";
import GetGroupEvent from "./GetGroupEvent";
import GetUserGroupEvent from "./GetUserGroupEvent";
import { game } from "../../..";

export default class UpdateGroupRequestEvent implements ProtobuffListener<UpdateGroupRequestData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: UpdateGroupRequestData): Promise<void> {
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
            throw new Error("User is not group member.");
        }

        if(!userGroup.admin) {
            throw new Error("User is not group admin.");
        }

        const targetUserGroup = await UserGroupModel.findOne({
            where: {
                groupId: group.id,
                userId: payload.userId,

                pending: true
            }
        });

        if(!targetUserGroup) {
            throw new Error("Target request does not exist.");
        }

        if(payload.accept) {
            await targetUserGroup.update({
                pending: false
            });
        }
        else {
            await targetUserGroup.destroy();
        }
        
        await new GetGroupEvent().handle(user, GetGroupData.create({
            id: group.id
        }));

        await new GetUserGroupEvent().handle(user, GetUserGroupData.create({
            id: group.id
        }));

        const targetUser = game.getUserById(targetUserGroup.userId);

        if(targetUser) {
            await new GetGroupEvent().handle(targetUser, GetGroupData.create({
                id: group.id
            }));

                await new GetUserGroupEvent().handle(targetUser, GetUserGroupData.create({
                id: group.id
            }));
        }
    }
}
