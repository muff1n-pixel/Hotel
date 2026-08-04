import { FurnitureData, GetUserInventorySongDisksData, GetUserInventorySoundSetsData, UserFurnitureData, UserInventorySongDisksData, UserInventorySoundSetsData } from "@pixel63/events";
import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";

export default class GetUserInventorySoundSetsEvent implements ProtobuffListener<GetUserInventorySoundSetsData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User): Promise<void> {
        const songDisks = await UserFurnitureModel.findAll({
            where: {
                userId: user.model.id,
                roomId: null,
                traxId: null
            },
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture",

                    where: {
                        interactionType: "sound_set"
                    }
                }
            ]
        });

        const uniqueSoundSets = [...new Map(songDisks.map((userFurniture) => [userFurniture.furniture.id, userFurniture.furniture])).values()].sort((a, b) => a.type.localeCompare(b.type));
        
        user.sendProtobuff(UserInventorySoundSetsData, UserInventorySoundSetsData.create({
            sets: uniqueSoundSets.map((disk) => FurnitureData.fromJSON(disk.toJSON()))
        }));
    }
}
