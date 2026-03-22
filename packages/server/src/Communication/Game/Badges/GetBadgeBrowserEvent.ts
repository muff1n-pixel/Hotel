import User from "../../../Users/User.js";
import { BadgeBrowserData, BadgeData, GetBadgeBrowserData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { Op } from "sequelize";
import { BadgeModel } from "../../../Database/Models/Badges/BadgeModel.js";

export default class GetBadgeBrowserEvent implements ProtobuffListener<GetBadgeBrowserData> {
    async handle(user: User, payload: GetBadgeBrowserData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("badges:edit")) {
            throw new Error("User does not have appropriate privileges.");
        }

        const { rows: badges, count } = await BadgeModel.findAndCountAll({
            limit: 50,
            offset: payload.offset,

            where: {
                ...(payload.searchId.length && {
                    id: payload.searchId
                }),
                
                ...(payload.searchName.length && {
                    name: {
                        [Op.like]: `%${payload.searchName}%`
                    }
                }),
                
                ...(payload.searchImage.length && {
                    image: {
                        [Op.like]: `%${payload.searchImage}%`
                    }
                }),
            },
            order: ["image"]
        });

        user.sendProtobuff(BadgeBrowserData, BadgeBrowserData.create({
            badges: badges.map((badge) => BadgeData.fromJSON(badge)),
            count
        }));
    }
}
