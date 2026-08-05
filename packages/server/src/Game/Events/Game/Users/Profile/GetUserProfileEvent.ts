import { BadgeData, GetUserProfileData, GroupData, GroupMemberData, UserGroupMemberData, UserProfileData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";
import { UserModel } from "../../../../../Database/Models/Users/UserModel";
import { UserBadgeModel } from "../../../../../Database/Models/Users/Badges/UserBadgeModel";
import { BadgeModel } from "../../../../../Database/Models/Badges/BadgeModel";
import { Op } from "sequelize";
import { game } from "../../../..";
import { UserFriendModel } from "../../../../../Database/Models/Users/Friends/UserFriendModel";
import { UserGroupModel } from "../../../../../Database/Models/Users/Groups/UserGroupModel";
import { GroupModel } from "../../../../../Database/Models/Groups/RoomGroupModel";
import { UserAchievementModel } from "../../../../../Database/Models/Users/Achievements/UserAchievementModel";

export default class GetUserProfileEvent implements UserProtobuffListener<GetUserProfileData> {
    minimumDurationBetweenEvents?: number = 500;

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

        const friends = await UserFriendModel.findAll({
            where: {
                userId: targetUser.id,
                relationship: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: UserModel,
                    as: "friend"
                }
            ]
        });

        const userGroups = await UserGroupModel.findAll({
            where: {
                userId: targetUser.id
            },
            include: {
                model: GroupModel,
                as: "group"
            }
        });

        const achievementScore = await UserAchievementModel.sum("score", {
            where: {
                userId: targetUser.id
            }
        });

        user.sendProtobuff(UserProfileData, UserProfileData.create({
            id: targetUser.id,

            name: targetUser.name,
            motto: targetUser.motto ?? undefined,

            figureConfiguration: targetUser.figureConfiguration,

            badges: badges.map((userBadge) => BadgeData.fromJSON(userBadge.badge)),

            online: game.users.some((user) => user.model.id === targetUser.id),
            lastOnlineAt: targetUser.lastLogin?.toISOString(),

            createdAt: targetUser.createdAt.toISOString(),

            friendsCount: await UserFriendModel.count({
                where: {
                    userId: targetUser.id
                }
            }),

            loveRelationships: friends.filter((friend) => friend.relationship === "love").map((friend) => {
                return {
                    userId: friend.friend.id,
                    name: friend.friend.name,
                    figureConfigurationData: friend.friend.figureConfiguration
                }
            }),

            smileRelationships: friends.filter((friend) => friend.relationship === "smile").map((friend) => {
                return {
                    userId: friend.friend.id,
                    name: friend.friend.name,
                    figureConfigurationData: friend.friend.figureConfiguration
                }
            }),

            bobbaRelationships: friends.filter((friend) => friend.relationship === "bobba").map((friend) => {
                return {
                    userId: friend.friend.id,
                    name: friend.friend.name,
                    figureConfigurationData: friend.friend.figureConfiguration
                }
            }),

            groups: userGroups.map((userGroup) => UserGroupMemberData.create({
                group: GroupData.fromJSON(userGroup.group),
                member: GroupMemberData.fromJSON(userGroup)
            })),

            achievementScore
        }));
    }
}
