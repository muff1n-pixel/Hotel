import RoomUser from "../../../Users/RoomUser";
import RoomPetSitAction from "../../Actions/RoomPetSitAction";
import { RoomPetState } from "../../RoomPet";
import PetCommand from "../PetCommand";

export default class PetSitCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        await this.roomPet.addExperiencePoints(5, 5);

        this.roomPet.action = new RoomPetSitAction(this.roomPet);
    }
}
