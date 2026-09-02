import RoomUser from "../../../Users/RoomUser";
import { RoomPetState } from "../../RoomPet";
import PetCommand from "../PetCommand";

export default class PetSitCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.actions.state === RoomPetState.SIT) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        await this.roomPet.addExperiencePoints(5, 5);

        this.roomPet.actions.sit();
    }
}
