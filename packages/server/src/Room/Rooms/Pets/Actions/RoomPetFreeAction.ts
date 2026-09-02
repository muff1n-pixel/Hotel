import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";

export default class RoomPetFreeAction implements RoomPetAction {
    constructor(private readonly roomPet: RoomPet) {
        this.roomPet.pose.stand();
    }

    async handleActionsInterval(): Promise<void> {
        await this.roomPet.handleRelaxed();
    }
}
