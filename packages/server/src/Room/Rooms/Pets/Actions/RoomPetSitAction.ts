import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";

export default class RoomPetSitAction implements RoomPetAction {
    public readonly expiresAt: number;

    constructor(private readonly roomPet: RoomPet) {
        this.expiresAt = performance.now() + 5000;

        this.roomPet.pose.sit();
    }
}
