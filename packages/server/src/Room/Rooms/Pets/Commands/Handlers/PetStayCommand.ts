import RoomUser from "../../../Users/RoomUser";
import RoomPetDownAction from "../../Actions/RoomPetDownAction";
import PetCommand from "../PetCommand";

export default class PetStayCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        await this.roomPet.addExperiencePoints(5, 5);

        this.roomPet.action = new RoomPetDownAction(this.roomPet);
    }
}
