import { BadgeData, GetUserFriendRelationshipsData, GetUserProfileData, UserFriendRelationshipsData, UserProfileData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserModel } from "../../../../Database/Models/Users/UserModel";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel";
import { Op } from "sequelize";
import { game } from "../../../..";
import { UserFriendModel } from "../../../../Database/Models/Users/Friends/UserFriendModel";

export default class GetUserFriendRelationshipsEvent implements ProtobuffListener<GetUserFriendRelationshipsData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: GetUserFriendRelationshipsData): Promise<void> {
        const friends = await UserFriendModel.findAll({
            where: {
                userId: payload.userId,
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

        user.sendProtobuff(UserFriendRelationshipsData, UserFriendRelationshipsData.create({
            userId: payload.userId,

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
            })
        }));
    }
}
