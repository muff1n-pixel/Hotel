import RoomUser from "../../../Users/RoomUser";
import RoomPetJumpAction from "../../Actions/RoomPetJumpAction";
import PetCommand from "../PetCommand";

export default class PetJumpCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        await this.roomPet.addExperiencePoints(5, 5);

        this.roomPet.action = new RoomPetJumpAction(this.roomPet);
    }
}
