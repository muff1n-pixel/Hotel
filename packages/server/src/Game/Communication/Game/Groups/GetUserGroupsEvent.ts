import { GetUserGroupsData, GroupData, GroupMemberData, UserGroupData, UserGroupsData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel";

export default class GetUserGroupsEvent implements ProtobuffListener<GetUserGroupsData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: GetUserGroupsData): Promise<void> {
        const userGroups = await UserGroupModel.findAll({
            where: {
                userId: user.model.id,
                pending: false
            },
            include: {
                model: GroupModel,
                as: "group"
            }
        });

        user.sendProtobuff(UserGroupsData, UserGroupsData.create({
            groups: userGroups.map((userGroup) => {
                return GroupData.fromJSON(userGroup.group)
            })
        }));
    }
}
