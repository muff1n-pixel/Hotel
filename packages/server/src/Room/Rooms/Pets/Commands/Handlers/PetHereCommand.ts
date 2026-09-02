import Directions from "../../../../../Helpers/Directions";
import RoomUser from "../../../Users/RoomUser";
import RoomPetWalkToUserAction from "../../Actions/RoomPetWalkToUserAction";
import PetCommand from "../PetCommand";

export default class PetHereCommand extends PetCommand {
    public validate(roomUser: RoomUser): boolean {
        return roomUser.user.model.id === this.roomPet.model.user.id;
    }

    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.level < 2) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        this.roomPet.action = new RoomPetWalkToUserAction(this.roomPet, roomUser);
    }
}
