import User from "../../../../Users/User.js";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel.js";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { GetUserBadgesData, GroupData, UserBadgesData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { UserAchievementModel } from "../../../../Database/Models/Users/Achievements/UserAchievementModel.js";
import { UserGroupModel } from "../../../../Database/Models/Users/Groups/UserGroupModel.js";
import { GroupModel } from "../../../../Database/Models/Groups/RoomGroupModel.js";

export default class GetUserBadgesEvent implements ProtobuffListener<GetUserBadgesData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: User, payload: GetUserBadgesData) {
        const targetUser = await UserModel.findOne({
            where: {
                id: payload.id
            }
        });

        if(!targetUser) {
            throw new Error("User does not exist.");
        }

        const equippedBadges = await UserBadgeModel.findAll({
            where: {
                userId: targetUser.id,
                equipped: true
            },
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: BadgeModel,
                    as: "badge"
                }
            ]
        });
        
        const achievementScore = await UserAchievementModel.sum("score", {
            where: {
                userId: targetUser.id
            }
        });

        const favouriteUserGroup = await UserGroupModel.findOne({
            where: {
                userId: targetUser.id,
                favourite: true
            },
            include: {
                model: GroupModel,
                as: "group"
            }
        });

        user.sendProtobuff(UserBadgesData, UserBadgesData.create({
            userId: payload.id,
            achievementScore,
            
            badges: equippedBadges.map((userBadge) => {
                return {
                    id: userBadge.badge.id,
                    name: userBadge.badge.name ?? undefined,
                    description: userBadge.badge.description ?? undefined,
                    image: userBadge.badge.image
                };
            }),

            group: ((favouriteUserGroup)?(GroupData.fromJSON(favouriteUserGroup.group)):(undefined))
        }));
    }
}
