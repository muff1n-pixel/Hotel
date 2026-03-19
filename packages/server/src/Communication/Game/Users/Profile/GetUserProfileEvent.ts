import { BadgeData, GetUserInventoryFurnitureData, GetUserInventoryPetsData, GetUserProfileData, UserBadgeData, UserProfileData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserModel } from "../../../../Database/Models/Users/UserModel";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel";
import { Op } from "sequelize";
import { game } from "../../../..";
import { UserFriendModel } from "../../../../Database/Models/Users/Friends/UserFriendModel";

export default class GetUserProfileEvent implements ProtobuffListener<GetUserProfileData> {
    async handle(user: User, payload: GetUserProfileData): Promise<void> {
        const targetUser = await UserModel.findByPk(payload.userId);

        if(!targetUser) {
            throw new Error("Target user does not exist.");
        }

        const badges = await UserBadgeModel.findAll({
            where: {
                userId: targetUser.id,
                equipped: true
            },
            include: [
                {
                    model: BadgeModel,
                    as: "badge"
                }
            ]
        });

        user.sendProtobuff(UserProfileData, UserProfileData.create({
            id: targetUser.id,

            name: targetUser.name,
            motto: targetUser.motto ?? undefined,

            figureConfiguration: targetUser.figureConfiguration,

            badges: badges.map((userBadge) => BadgeData.fromJSON(userBadge.badge)),

            online: game.users.some((user) => user.model.id === targetUser.id),
            lastOnlineAt: targetUser.lastLogin?.toString(),

            createdAt: targetUser.createdAt.toString(),

            friendsCount: await UserFriendModel.count({
                where: {
                    userId: targetUser.id
                }
            })
        }));
    }
}
