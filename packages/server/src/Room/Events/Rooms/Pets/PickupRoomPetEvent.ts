import { PickupRoomPetData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";

export default class PickupRoomPetEvent implements RoomProtobuffListener<PickupRoomPetData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: PickupRoomPetData) {

        const userPet = user.roomUser.room.getPetById(payload.id);

        if(userPet.model.user.id !== user.model.id) {
            throw new Error("User is not owner of the pet.");
        }

        await userPet.pickup();
    }
}
