import User from "../../../../Users/User.js";
import { RoomPetsData, ScratchRoomPetData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener.js";

export default class ScratchRoomPetEvent implements ProtobuffListener<ScratchRoomPetData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User, payload: ScratchRoomPetData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        const roomPet = user.room.pets.find((roomPet) => roomPet.model.id === payload.petId);

        if(!roomPet) {
            throw new Error("Pet does not exist in room.");
        }

        if(user.model.scratches === 0) {
            throw new Error("User does not have any scratches left.");
        }

        user.model.scratches--;

        await user.model.save();

        user.sendUserData();

        roomPet.model.scratches++;

        await roomPet.model.save();

        roomUser.addAction("Wave", 3000);

        roomPet.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
            petsUpdated: [
                roomPet.model
            ]
        }));

        roomPet.sendInformationMessage(`${roomPet.model.name} was scratched!`);
    }
}
