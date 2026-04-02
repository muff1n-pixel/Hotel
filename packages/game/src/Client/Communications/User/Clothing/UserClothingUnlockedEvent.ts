import { clientInstance } from "../../../..";
import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserClothingUnlockedData } from "@pixel63/events";

export default class UserClothingUnlockedEvent implements ProtobuffListener<UserClothingUnlockedData> {
    async handle(payload: UserClothingUnlockedData) {
        clientInstance.dialogs.value?.push({
            id: Math.random().toString(),
            type: "clothing-unlocked",
            data: {
                furniture: payload.furniture,
            }
        });
    }
}
