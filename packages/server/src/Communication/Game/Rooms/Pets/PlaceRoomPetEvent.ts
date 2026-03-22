import User from "../../../../Users/User.js";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";
import { PlaceRoomPetData } from "@pixel63/events";
import RoomPet from "../../../../Rooms/Pets/RoomPet.js";

export default class PlaceRoomPetEvent implements ProtobuffListener<PlaceRoomPetData> {
    async handle(user: User, payload: PlaceRoomPetData) {
        if(!user.room) {
            return;
        }

        if(user.model.id !== user.room.model.owner.id) {
            throw new Error("User does not own the room.");
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
