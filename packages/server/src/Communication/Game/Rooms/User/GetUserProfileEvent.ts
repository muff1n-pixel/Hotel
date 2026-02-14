import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { GetUserProfileEventData } from "@shared/Communications/Requests/Rooms/User/GetUserProfileEventData.js";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel.js";
import { UserProfileEventData } from "@shared/Communications/Responses/Rooms/Users/UserProfileEventData.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";

export default class GetUserProfileEvent implements IncomingEvent<GetUserProfileEventData> {
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

        user.send(new OutgoingEvent<UserProfileEventData>("UserProfileEvent", {
            userId: event.userId,
            motto: targetUser.motto,
            badges: equippedBadges.map((userBadge) => {
                return {
                    id: userBadge.id,
                    badge: {
                        id: userBadge.badge.id,
                        name: userBadge.badge.name,
                        description: userBadge.badge.description,
                        image: userBadge.badge.image
                    },
                    equipped: userBadge.equipped
                };
            })
        }));
    }
}
