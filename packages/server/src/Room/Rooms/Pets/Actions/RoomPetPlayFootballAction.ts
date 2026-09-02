import { RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../Helpers/Directions";
import RoomFurnitureFootballLogic from "../../Furniture/Logic/Games/RoomFurnitureFootballLogic";
import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomPetFreeAction from "./RoomPetFreeAction";
import RoomFurniture from "../../Furniture/RoomFurniture";

export default class RoomPetPlayFootballAction implements RoomPetAction {
    expiresAt?: number;

    constructor(private readonly roomPet: RoomPet) {
        this.roomPet.pose.stand();
        
        const footballFurniture = this.roomPet.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFootballLogic);

        const closestFootballFurniture = Directions.getClosestPosition(RoomPositionOffsetData.fromJSON(this.roomPet.position), footballFurniture, (furniture) => furniture.model.position);
        
        if(!closestFootballFurniture) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            this.roomPet.action = new RoomPetFreeAction(this.roomPet);

            return;
        }

        this.roomPet.path.finishPath();

        this.roomPet.path.walkTo(RoomPositionOffsetData.fromJSON(closestFootballFurniture.model.position), false, this.handleFinishWalk.bind(this, closestFootballFurniture), this.handleCancelledWalk.bind(this));
    }
    
    private async handleFinishWalk(closestFootballFurniture: RoomFurniture) {
        await this.roomPet.addExperiencePoints(10, 10);

        this.roomPet.sendVocal("PLAYFUL");

        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }

    private async handleCancelledWalk() {
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
}
