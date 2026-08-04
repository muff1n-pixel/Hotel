import { GetGroupMembersData, GroupData, GroupMembersData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { UserModel } from "../../../Database/Models/Users/UserModel";
import { Op } from "sequelize";

export default class GetGroupMembersEvent implements ProtobuffListener<GetGroupMembersData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: GetGroupMembersData): Promise<void> {
        const userGroups = await UserGroupModel.findAll({
            where: {
                groupId: payload.id,
                
                ...(payload.filter === "admin" && {
                    admin: true    
                })
            },
            include: {
                model: UserModel,
                as: "user",
                where: {
                    ...(payload.name && {
                        name: {
                            [Op.like]: `%${payload.name}%`
                        }
                    })
                }
            }
        });

        user.sendProtobuff(GroupMembersData, GroupMembersData.create({
            groupId: payload.id,

            members: userGroups.sort((a, b) => {
                return (((b.owner)?(1):(0)) + ((b.admin)?(1):(0))) - (((a.owner)?(1):(0)) + ((a.admin)?(1):(0)));
            }).map((userGroup) => {
                return {
                    userId: userGroup.userId,
                    admin: userGroup.admin,
                    owner: userGroup.owner,

                    pending: userGroup.pending,

                    createdAt: userGroup.createdAt.toISOString(),

                    name: userGroup.user.name,
                    figureConfiguration: userGroup.user.figureConfiguration
                };
            })
        }));
    }
}
