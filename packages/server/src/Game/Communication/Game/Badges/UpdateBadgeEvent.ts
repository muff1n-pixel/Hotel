import User from "../../../Users/User.js";
import { GetBadgeBrowserData, UpdateBadgeData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { BadgeModel } from "../../../Database/Models/Badges/BadgeModel.js";
import GetBadgeBrowserEvent from "./GetBadgeBrowserEvent.js";

export default class UpdateBadgeEvent implements ProtobuffListener<UpdateBadgeData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: UpdateBadgeData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("badges:edit")) {
            throw new Error("User does not have edit badges privileges.");
        }

        const badge = await BadgeModel.upsert({
            id: payload.id,

            image: payload.image,

            name: payload.name,
            description: payload.description
        });

        new GetBadgeBrowserEvent().handle(user, GetBadgeBrowserData.create({
            offset: 0
        })).catch(console.error);
    }
}
