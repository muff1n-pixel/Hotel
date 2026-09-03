import { RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../Helpers/Directions";
import RoomFurnitureFootballLogic from "../../Furniture/Logic/Games/RoomFurnitureFootballLogic";
import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomPetFreeAction from "./RoomPetFreeAction";
import RoomFurniture from "../../Furniture/RoomFurniture";
import RoomFurniturePetToyLogic from "../../Furniture/Logic/RoomFurniturePetToyLogic";

export default class RoomPetPlayAction implements RoomPetAction {
    expiresAt?: number;

    constructor(private readonly roomPet: RoomPet) {
        this.roomPet.pose.stand();
        
        const toyFurniture = this.roomPet.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurniturePetToyLogic);

        const closestToyFurniture = Directions.getClosestPosition(RoomPositionOffsetData.fromJSON(this.roomPet.position), toyFurniture, (furniture) => furniture.model.position);
        
        if(!closestToyFurniture) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            this.roomPet.action = new RoomPetFreeAction(this.roomPet);

            return;
        }

        this.roomPet.path.finishPath();

        this.roomPet.path.walkTo(RoomPositionOffsetData.fromJSON(closestToyFurniture.model.position), false, this.handleFinishWalk.bind(this, closestToyFurniture), this.handleCancelledWalk.bind(this));
    }
    
    private async handleFinishWalk(closestFootballFurniture: RoomFurniture) {
        await this.roomPet.addExperiencePoints(10, 10);

        this.roomPet.sendVocal("PLAYFUL");

        this.roomPet.pose.play();

        this.expiresAt = performance.now() + 1000;
    }

    private async handleCancelledWalk() {
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
}
