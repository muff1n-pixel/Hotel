import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { GetUserProfileEventData } from "@shared/Communications/Requests/Rooms/User/GetUserProfileEventData.js";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { UserBadgesData } from "@pixel63/events";

export default class GetUserProfileEvent implements IncomingEvent<GetUserProfileEventData> {
    public readonly name = "GetUserProfileEvent";

    async handle(user: User, event: GetUserProfileEventData) {
        const targetUser = await UserModel.findOne({
            where: {
                id: event.userId
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
            userId: event.userId,
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
