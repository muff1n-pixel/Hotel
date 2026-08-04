import { JoinGroupData, GroupData, GetGroupData, GetUserGroupData, RoomGroupData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel, GroupType } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel";
import { UserModel } from "../../../Database/Models/Users/UserModel";
import GetGroupEvent from "./GetGroupEvent";
import GetUserGroupEvent from "./GetUserGroupEvent";

export default class JoinGroupEvent implements ProtobuffListener<JoinGroupData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: JoinGroupData): Promise<void> {
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

        if(userGroup) {
            throw new Error("User is already group member.");
        }

        switch(group.type) {
            case GroupType.PRIVATE: {
                throw new Error("Group is private.");
            }

            case GroupType.PUBLIC: {
                await UserGroupModel.create({
                    userId: user.model.id,
                    groupId: group.id,

                    owner: false,
                    admin: false,

                    pending: false
                });

                break;
            }

            case GroupType.EXCLUSIVE: {
                await UserGroupModel.create({
                    userId: user.model.id,
                    groupId: group.id,

                    owner: false,
                    admin: false,

                    pending: true
                });

                break;
            }
        }
        
        await new GetGroupEvent().handle(user, GetGroupData.create({
            id: group.id
        }));

        await new GetUserGroupEvent().handle(user, GetUserGroupData.create({
            id: group.id
        }));
    }
}
