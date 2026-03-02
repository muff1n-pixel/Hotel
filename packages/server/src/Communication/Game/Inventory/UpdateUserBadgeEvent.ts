import User from "../../../Users/User.js";
import { UserBadgeModel } from "../../../Database/Models/Users/Badges/UserBadgeModel.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { UpdateUserBadgeData } from "@pixel63/events";

export default class UpdateUserBadgeEvent implements ProtobuffListener<UpdateUserBadgeData> {
    public readonly name = "UpdateUserBadgeEvent";

    async handle(user: User, payload: UpdateUserBadgeData): Promise<void> {
        const userBadge = await UserBadgeModel.findOne({
            where: {
                id: payload.badgeId,
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

        if(payload.equipped && equippedBadgesCount === 6) {
            throw new Error("User already has 6 equipped badges.");
        }

        userBadge.equipped = payload.equipped;

        if(userBadge.changed()) {
            await userBadge.save();

            await user.getInventory().sendBadges();
        }
    }
}
