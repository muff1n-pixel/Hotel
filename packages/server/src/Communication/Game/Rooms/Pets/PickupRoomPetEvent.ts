import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PickupRoomPetData } from "@pixel63/events";

export default class PickupRoomPetEvent implements ProtobuffListener<PickupRoomPetData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: PickupRoomPetData) {
        if(!user.room) {
            return;
        }

        const userPet = user.room.getPetById(payload.id);

        if(userPet.model.user.id !== user.model.id) {
            throw new Error("User is not owner of the pet.");
        }

        await userPet.pickup();
    }
}
