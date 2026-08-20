import RoomUser from "../../../Users/RoomUser";
import { RoomPetState } from "../../RoomPet";
import PetCommand from "../PetCommand";

export default class PetFreeCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.actions.state === RoomPetState.FREE) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        this.roomPet.actions.free();
    }
}
