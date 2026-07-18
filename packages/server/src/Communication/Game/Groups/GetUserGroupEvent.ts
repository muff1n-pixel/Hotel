import { GetUserGroupData, GroupData, UserGroupData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";

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
            return;
        }

        user.sendProtobuff(UserGroupData, UserGroupData.fromJSON(userGroup))
    }
}
