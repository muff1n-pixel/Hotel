import RoomUser from "../../../Users/RoomUser";
import PetCommand from "../PetCommand";

export default class PetFreeCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        this.roomPet.setFree();
    }
}
