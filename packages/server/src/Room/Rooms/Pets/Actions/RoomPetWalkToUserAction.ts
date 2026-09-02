import Directions from "../../../../Helpers/Directions";
import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomPetFreeAction from "./RoomPetFreeAction";

export default class RoomPetWalkToUserAction implements RoomPetAction {
    expiresAt?: number;

    constructor(private readonly roomPet: RoomPet, private readonly roomUser: RoomUser) {
        this.roomPet.pose.stand();

        const position = roomUser.getOffsetPosition(1);

        this.roomPet.path.finishPath();
        
        this.roomPet.path.walkTo(position, false, this.handleFinishWalk.bind(this, roomUser), this.handleCancelledWalk.bind(this));
    }

    private async handleFinishWalk(roomUser: RoomUser) {
        this.roomPet.direction = Directions.normalizeDirection(roomUser.direction + 4);

        this.roomPet.sendDirectionEvent();

        await this.roomPet.addExperiencePoints(5, 5);
        
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
    
    private async handleCancelledWalk() {
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
}
