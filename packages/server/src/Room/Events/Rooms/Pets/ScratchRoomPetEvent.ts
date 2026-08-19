import { RoomPetExperiencePointsData, RoomPetsData, ScratchRoomPetData, ServerUserUpdatedData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener";
import User from "../../../Users/User";
import RoomServer from "../../../RoomServer";
import RoomPet from "../../../Rooms/Pets/RoomPet";

export default class ScratchRoomPetEvent implements RoomProtobuffListener<ScratchRoomPetData> {
    minimumDurationBetweenEvents?: number = 10;

    async handle(user: User, payload: ScratchRoomPetData) {
        const roomPet = user.roomUser.room.pets.find((roomPet) => roomPet.model.id === payload.petId);

        if(!roomPet) {
            throw new Error("Pet does not exist in room.");
        }

        if(user.model.scratches === 0) {
            throw new Error("User does not have any scratches left.");
        }

        const targetOffsetPosition = roomPet.getOffsetPosition(1);

        user.roomUser.path.walkTo(targetOffsetPosition, undefined, this.handlePetScratch.bind(this, user, roomPet), this.handlePetScratch.bind(this, user, roomPet));
    }

    private async handlePetScratch(user: User, roomPet: RoomPet) {
        if(user.model.scratches === 0) {
            throw new Error("User does not have any scratches left.");
        }

        user.model.scratches--;

        await user.save();

        RoomServer.websocket.sendServerProtobuff(ServerUserUpdatedData, ServerUserUpdatedData.create({
            userId: user.model.id
        }));

        user.roomUser.pose.pet();

        roomPet.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
            petsUpdated: [
                roomPet.model
            ]
        }));

        roomPet.sendInformationMessage(`${roomPet.model.name} was scratched!`);

        roomPet.model.scratches++;

        await roomPet.model.save();

        roomPet.room.sendProtobuff(RoomPetExperiencePointsData, RoomPetExperiencePointsData.create({
            petId: roomPet.model.id,
            experiencePoints: 10
        }));
    }
}
