import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomPetFreeAction from "./RoomPetFreeAction";
import Directions from "../../../../Helpers/Directions";

export default class RoomPetMoveAction implements RoomPetAction {
    constructor(private readonly roomPet: RoomPet, private readonly direction: number = Directions.BEHIND) {
        const targetPosition = Directions.getPositionFromOffset(1, roomPet.position, Directions.normalizeDirection(roomPet.direction + this.direction));

        this.roomPet.path.walkTo(targetPosition, false, this.handleFinishWalk.bind(this), this.handleFinishWalk.bind(this));
    }

    async handleActionsInterval(): Promise<void> {
    }

    private async handleFinishWalk() {
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
}
