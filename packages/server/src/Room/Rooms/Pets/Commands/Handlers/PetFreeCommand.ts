import RoomUser from "../../../Users/RoomUser";
import RoomPetFreeAction from "../../Actions/RoomPetFreeAction";
import PetCommand from "../PetCommand";

export default class PetFreeCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
}
