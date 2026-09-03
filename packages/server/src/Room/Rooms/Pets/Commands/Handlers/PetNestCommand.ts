import RoomUser from "../../../Users/RoomUser";
import RoomPetNestAction from "../../Actions/RoomPetNestAction";
import PetCommand from "../PetCommand";

export default class PetNestCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        this.roomPet.action = new RoomPetNestAction(this.roomPet);
    }
}
