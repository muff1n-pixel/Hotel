import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";

export default class RoomPetStandAction implements RoomPetAction {
    public readonly expiresAt: number;

    constructor(private readonly roomPet: RoomPet) {
        this.expiresAt = performance.now() + 5000;

        this.roomPet.pose.stand();
    }
}
