import { UpdateUserBadgeEventData } from "@shared/Communications/Requests/Inventory/Badges/UpdateUserBadgeEventData.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { UserBadgeModel } from "../../../Database/Models/Users/Badges/UserBadgeModel.js";

export default class UpdateUserBadgeEvent implements IncomingEvent<UpdateUserBadgeEventData> {
    async handle(user: User, event: UpdateUserBadgeEventData): Promise<void> {
        const userBadge = await UserBadgeModel.findOne({
            where: {
                id: event.badgeId,
                userId: user.model.id
            }
        });

        if(!userBadge) {
            throw new Error("User badge does not exist.");
        }

        const equippedBadgesCount = await UserBadgeModel.count({
            where: {
                userId: user.model.id,
                equipped: true
            }
        });

        if(event.equipped && equippedBadgesCount === 6) {
            throw new Error("User already has 6 equipped badges.");
        }

        userBadge.equipped = event.equipped;

        if(userBadge.changed()) {
            await userBadge.save();

            await user.getInventory().sendBadges();
        }
    }
}
