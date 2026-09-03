import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomPetFreeAction from "./RoomPetFreeAction";
import Directions from "../../../../Helpers/Directions";

export default class RoomPetFollowUserAction implements RoomPetAction {
    private readonly userId: string;

    constructor(private readonly roomPet: RoomPet, roomUser: RoomUser, private readonly direction: number = Directions.BEHIND) {
        this.userId = roomUser.user.model.id;
    }

    async handleActionsInterval(): Promise<void> {
        const roomUser = this.roomPet.room.users.find((roomUser) => roomUser.user.model.id === this.userId);

        if(!roomUser) {
            this.roomPet.action = new RoomPetFreeAction(this.roomPet);

            return;
        }

        const targetPosition = Directions.getPositionFromOffset(1, roomUser.position, Directions.normalizeDirection(roomUser.direction + this.direction));

        this.roomPet.path.walkTo(targetPosition);
    }
}
