import RoomUser from "../../../Users/RoomUser";
import PetCommand from "../PetCommand";
import RoomPetEatAction from "../../Actions/RoomPetEatAction";

export default class PetEatCommand extends PetCommand {
    public validate(roomUser: RoomUser): boolean {
        return roomUser.user.model.id === this.roomPet.model.user.id;
    }

    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy >= 100) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }
        
        this.roomPet.action = new RoomPetEatAction(this.roomPet);
    }
}
