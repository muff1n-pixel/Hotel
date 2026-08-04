import RoomUser from "../../../Users/RoomUser";
import PetCommand from "../PetCommand";

export default class PetSitCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        await this.roomPet.path.finishPath();

        this.roomPet.setSit();
    }
}
