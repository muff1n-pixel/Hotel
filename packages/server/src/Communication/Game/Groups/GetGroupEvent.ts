import { GetGroupData, GroupData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel";
import { UserModel } from "../../../Database/Models/Users/UserModel";

export default class GetGroupEvent implements ProtobuffListener<GetGroupData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: GetGroupData): Promise<void> {
        const group = await GroupModel.findByPk(payload.id);

        if(!group) {
            throw new Error("Group does not exist.");
        }

        const membersCount = await UserGroupModel.count({
            where: {
                groupId: group.id
            }
        });

        const room = await RoomModel.findOne({
            where: {
                groupId: group.id
            },
            include: {
                model: UserModel,
                as: "owner"
            }
        });

        user.sendProtobuff(GroupData, GroupData.fromJSON({
            ...group.toJSON(),
            
            membersCount,

            owner: {
                id: room?.owner.id,
                name: room?.owner.name,
            }
        }));
    }
}
