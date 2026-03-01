import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { game } from "../../../index.js";
import { RoomCategoriesData } from "@pixel63/events";

export default class GetRoomCategoriesEvent implements IncomingEvent {
    public readonly name = "GetRoomCategoriesEvent";

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
