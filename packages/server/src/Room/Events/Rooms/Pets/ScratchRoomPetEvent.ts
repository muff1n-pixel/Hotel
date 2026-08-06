import { RoomPetsData, ScratchRoomPetData, ServerUserUpdatedData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";
import RoomServer from "../../../RoomServer";

export default class ScratchRoomPetEvent implements RoomProtobuffListener<ScratchRoomPetData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User, payload: ScratchRoomPetData) {
        const roomPet = user.roomUser.room.pets.find((roomPet) => roomPet.model.id === payload.petId);

        if(!roomPet) {
            throw new Error("Pet does not exist in room.");
        }

        const model = await user.getUser();

        if(model.scratches === 0) {
            throw new Error("User does not have any scratches left.");
        }

        model.scratches--;

        await model.save();

        RoomServer.websocket.sendServerProtobuff(ServerUserUpdatedData, ServerUserUpdatedData.create({
            userId: user.id
        }));

        roomPet.model.scratches++;

        await roomPet.model.save();

        user.roomUser.pose.wave();

        roomPet.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
            petsUpdated: [
                roomPet.model
            ]
        }));

        roomPet.sendInformationMessage(`${roomPet.model.name} was scratched!`);
    }
}
