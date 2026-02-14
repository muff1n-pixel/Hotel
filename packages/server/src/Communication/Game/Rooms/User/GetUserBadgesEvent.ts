import IncomingEvent from "../../../Interfaces/IncomingEvent.js";
import User from "../../../../Users/User.js";
import { GetUserBadgesEventData } from "@shared/Communications/Requests/Rooms/User/GetUserBadgesEventData.js";
import { UserBadgeModel } from "../../../../Database/Models/Users/Badges/UserBadgeModel.js";
import OutgoingEvent from "../../../../Events/Interfaces/OutgoingEvent.js";
import { BadgeModel } from "../../../../Database/Models/Badges/BadgeModel.js";
import { UserBadgesEventData } from "@shared/Communications/Responses/Rooms/Users/UserBadgesEventData.js";

export default class GetUserBadgesEvent implements IncomingEvent<GetUserBadgesEventData> {
    async handle(user: User, event: GetUserBadgesEventData) {
        const equippedBadges = await UserBadgeModel.findAll({
            where: {
                userId: event.userId,
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

        user.send(new OutgoingEvent<UserBadgesEventData>("UserBadgesEvent", {
            userId: event.userId,
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
