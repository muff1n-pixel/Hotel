import Directions from "../../../../../Helpers/Directions";
import RoomUser from "../../../Users/RoomUser";
import PetCommand from "../PetCommand";

export default class PetHereCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.level < 2) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        if(this.roomPet.model.energy < 5) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        const position = roomUser.getOffsetPosition(1);

        this.roomPet.actions.free();

        await this.roomPet.path.finishPath();
        this.roomPet.path.walkTo(position, false, this.handleFinishWalk.bind(this, roomUser));
    }

    private async handleFinishWalk(roomUser: RoomUser) {
        this.roomPet.direction = Directions.normalizeDirection(roomUser.direction + 4);

        this.roomPet.sendDirectionEvent();

        await this.roomPet.addExperiencePoints(5, 5);
    }
}
