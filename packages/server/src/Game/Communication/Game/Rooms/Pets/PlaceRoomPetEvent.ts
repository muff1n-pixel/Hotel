import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PlaceRoomPetData } from "@pixel63/events";
import RoomPet from "../../../../Rooms/Pets/RoomPet.js";

export default class PlaceRoomPetEvent implements ProtobuffListener<PlaceRoomPetData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: PlaceRoomPetData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights() || !user.room.model.allowPets) {
            throw new Error("User is not allowed to place pets.");
        }

        const inventory = user.getInventory();

        const userPet = await inventory.getPetById(payload.id);

        if(!userPet) {
            throw new Error("User does not have a user pet by this id.");
        }

        if(!payload.position) {
            throw new Error();
        }

        await inventory.removePet(userPet);

        await RoomPet.place(user.room, userPet, payload.position, payload.direction);
    }
}
