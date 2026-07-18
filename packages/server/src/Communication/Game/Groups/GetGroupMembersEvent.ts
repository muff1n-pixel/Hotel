import { GetGroupMembersData, GroupData, GroupMembersData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { UserModel } from "../../../Database/Models/Users/UserModel";

export default class GetGroupMembersEvent implements ProtobuffListener<GetGroupMembersData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: GetGroupMembersData): Promise<void> {
        const userGroups = await UserGroupModel.findAll({
            where: {
                groupId: payload.id
            },
            include: {
                model: UserModel,
                as: "user"
            }
        });

        user.sendProtobuff(GroupMembersData, GroupMembersData.create({
            members: userGroups.map((userGroup) => {
                return {
                    userId: userGroup.userId,
                    admin: userGroup.admin,
                    owner: userGroup.owner,

                    createdAt: userGroup.createdAt,

                    name: userGroup.user.name,
                    figureConfiguration: userGroup.user.figureConfiguration
                };
            })
        }));
    }
}
