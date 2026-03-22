import User from "../../../Users/User.js";
import { FurnitureBrowserData, FurnitureData, GetFurnitureBrowserData, GetPetBrowserData, PetBrowserData, PetData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { Op } from "sequelize";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";

export default class GetFurnitureBrowserEvent implements ProtobuffListener<GetFurnitureBrowserData> {
    async handle(user: User, payload: GetFurnitureBrowserData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("furniture:edit")) {
            throw new Error("User does not have appropriate privileges.");
        }

        const { rows: items, count } = await FurnitureModel.findAndCountAll({
            limit: 20,
            offset: payload.offset,

            where: {
                ...(payload.searchId.length && {
                    id: payload.searchId
                }),
                
                ...(payload.searchType.length && {
                    type: {
                        [Op.like]: `%${payload.searchType}%`
                    }
                }),
                
                ...(payload.searchName.length && {
                    name: {
                        [Op.like]: `%${payload.searchName}%`
                    }
                }),
            },

            order: ["type", "color"]
        });

        user.sendProtobuff(FurnitureBrowserData, FurnitureBrowserData.create({
            furniture: items.map((item) => FurnitureData.fromJSON(item)),
            count
        }));
    }
}
