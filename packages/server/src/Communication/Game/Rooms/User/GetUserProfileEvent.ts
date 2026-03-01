import User from "../../../../Users/User.js";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel.js";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { GetUserBadgesData, UserBadgesData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class GetUserBadgesEvent implements ProtobuffListener<GetUserBadgesData> {
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

        user.sendProtobuff(UserBadgesData, UserBadgesData.create({
            userId: payload.id,
            badges: equippedBadges.map((userBadge) => {
                return {
                    id: userBadge.badge.id,
                    name: userBadge.badge.name ?? undefined,
                    description: userBadge.badge.description ?? undefined,
                    image: userBadge.badge.image
                };
            })
        }));
    }
}
