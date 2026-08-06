import User from "../../../Users/User.js";
import { game } from "../../../index.js";
import { GetRoomCategoriesData, RoomCategoriesData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class GetRoomCategoriesEvent implements UserProtobuffListener<GetRoomCategoriesData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User): Promise<void> {
        const permissions = await user.getPermissions();

        user.sendProtobuff(RoomCategoriesData, RoomCategoriesData.create({
            categories: game.roomNavigatorManager.categories.filter((category) => !category.developer || (category.developer && permissions.hasPermission("room:type"))).map((category) => {
                return {
                    id: category.id,
                    title: category.title
                };
            })
        }));
    }
}
