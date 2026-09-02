import RoomUser from "../../../Users/RoomUser";
import RoomPetPlayDeadAction from "../../Actions/RoomPetPlayDeadAction";
import PetCommand from "../PetCommand";

export default class PetPlayDeadCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        await this.roomPet.addExperiencePoints(5, 5);

        this.roomPet.action = new RoomPetPlayDeadAction(this.roomPet);
    }
}
