import { RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../Helpers/Directions";
import RoomFurnitureWaterBowlLogic from "../../Furniture/Logic/RoomFurnitureWaterBowlLogic";
import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomFurniture from "../../Furniture/RoomFurniture";
import RoomPetFreeAction from "./RoomPetFreeAction";

export default class RoomPetDrinkAction implements RoomPetAction {
    expiresAt?: number;
    
    constructor(private readonly roomPet: RoomPet) {
        const waterBowlFurniture = this.roomPet.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureWaterBowlLogic);

        const closestWaterBowlFurniture = Directions.getClosestPosition(RoomPositionOffsetData.fromJSON(this.roomPet.position), waterBowlFurniture, (furniture) => furniture.model.position);
        
        if(!closestWaterBowlFurniture) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        this.roomPet.pose.stand();

        this.roomPet.path.finishPath();

        this.roomPet.path.walkTo(RoomPositionOffsetData.fromJSON(closestWaterBowlFurniture.model.position), false, this.handleFinishWalk.bind(this, closestWaterBowlFurniture), this.handleCancelledWalk.bind(this));
    }

    private async handleFinishWalk(waterBowlFurniture: RoomFurniture) {
        this.roomPet.direction = Directions.normalizeDirection((waterBowlFurniture.model.direction ?? 0));

        this.roomPet.sendDirectionEvent();

        if(waterBowlFurniture.model.animation === 0) {
            this.roomPet.action = new RoomPetFreeAction(this.roomPet);

            this.roomPet.sendVocal("THIRSTY");

            return;
        }

        waterBowlFurniture.setAnimation(waterBowlFurniture.model.animation - 1);

        await this.roomPet.addExperiencePoints(5, -5);

        this.roomPet.pose.eat();
        
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);

        this.roomPet.sendVocal("DRINKING");
    }

    private async handleCancelledWalk() {
        this.roomPet.action = new RoomPetFreeAction(this.roomPet);
    }
}
