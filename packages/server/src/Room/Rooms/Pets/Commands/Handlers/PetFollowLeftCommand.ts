import Directions from "../../../../../Helpers/Directions";
import RoomUser from "../../../Users/RoomUser";
import RoomPetFollowUserAction from "../../Actions/RoomPetFollowUserAction";
import PetCommand from "../PetCommand";

export default class PetFollowLeftCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        await this.roomPet.addExperiencePoints(5, 5);

        this.roomPet.action = new RoomPetFollowUserAction(this.roomPet, roomUser, Directions.LEFT);
    }
}
