import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import { RoomCategoriesEventData } from "@shared/Communications/Responses/Navigator/RoomCategoriesEventData.js";
import { game } from "../../../index.js";

export default class GetRoomCategoriesEvent implements IncomingEvent {
    async handle(user: User): Promise<void> {
        user.send(new OutgoingEvent<RoomCategoriesEventData>("RoomCategoriesEvent", 
            game.roomNavigatorManager.categories.map((category) => {
                return {
                    id: category.id,
                    title: category.title
                };
            })
        ));
    }
}
