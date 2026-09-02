import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";

export default class RoomPetStayAction implements RoomPetAction {
    public readonly expiresAt?: number;

    constructor(private readonly roomPet: RoomPet) {
        this.roomPet.pose.stand();
    }
}
