import { PickupRoomPetData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser";

export default class PickupRoomPetEvent implements RoomProtobuffListener<PickupRoomPetData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: RoomWebSocketUser, payload: PickupRoomPetData) {

        const userPet = user.roomUser.room.getPetById(payload.id);

        if(userPet.model.user.id !== user.id) {
            throw new Error("User is not owner of the pet.");
        }

        await userPet.pickup();
    }
}
