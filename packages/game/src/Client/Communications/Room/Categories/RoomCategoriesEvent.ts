import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { RoomCategoriesData } from "@pixel63/events";

export default class RoomCategoriesEvent implements ProtobuffListener<RoomCategoriesData> {
    async handle(payload: RoomCategoriesData) {
        clientInstance.roomCategories.value = payload.categories;
    }
}
