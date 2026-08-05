import { GetUserGroupData, GroupData, GroupMemberData, UserGroupData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { UserGroupModel } from "../../../../Database/Models/Users/Groups/UserGroupModel";

export default class GetUserGroupEvent implements ProtobuffListener<GetUserGroupData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: GetUserGroupData): Promise<void> {
        const userGroup = await UserGroupModel.findOne({
            where: {
                groupId: payload.id,
                userId: user.model.id
            }
        });

        if(!userGroup) {
            user.sendProtobuff(UserGroupData, UserGroupData.create({
                groupId: payload.id
            }));

            return;
        }

        user.sendProtobuff(UserGroupData, UserGroupData.create({
            groupId: payload.id,

            member: GroupMemberData.create({
                admin: userGroup.admin,
                owner: userGroup.owner,

                userId: user.model.id,
                figureConfiguration: user.model.figureConfiguration,
                name: user.model.name,

                pending: userGroup.pending,
                
                createdAt: userGroup.createdAt.toISOString(),
                favourite: userGroup.favourite
            })
        }))
    }
}
