import RoomUser from "../../../Users/RoomUser";
import PetCommand from "../PetCommand";
import RoomPetPlayAction from "../../Actions/RoomPetPlayAction";

export default class PetPlayCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 10) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        this.roomPet.action = new RoomPetPlayAction(this.roomPet);
    }
}
