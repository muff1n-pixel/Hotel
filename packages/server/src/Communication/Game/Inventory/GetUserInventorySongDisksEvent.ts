import { GetUserInventorySongDisksData, UserFurnitureData, UserInventorySongDisksData } from "@pixel63/events";
import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";

export default class GetUserInventorySongDisksEvent implements ProtobuffListener<GetUserInventorySongDisksData> {
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
                        interactionType: "song_disk"
                    }
                }
            ]
        });
        
        user.sendProtobuff(UserInventorySongDisksData, UserInventorySongDisksData.create({
            disks: songDisks.map((disk) => UserFurnitureData.fromJSON(disk))
        }));
    }
}
