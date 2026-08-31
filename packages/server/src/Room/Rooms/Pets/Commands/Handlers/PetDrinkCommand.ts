import { RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../../Helpers/Directions";
import RoomFurnitureWaterBowlLogic from "../../../Furniture/Logic/RoomFurnitureWaterBowlLogic";
import RoomUser from "../../../Users/RoomUser";
import PetCommand from "../PetCommand";
import RoomFurniture from "../../../Furniture/RoomFurniture";

export default class PetDrinkCommand extends PetCommand {
    public validate(roomUser: RoomUser): boolean {
        return roomUser.user.model.id === this.roomPet.model.user.id;
    }

    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy >= 100) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        const waterBowlFurniture = this.roomPet.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureWaterBowlLogic);

        const closestWaterBowlFurniture = Directions.getClosestPosition(RoomPositionOffsetData.fromJSON(this.roomPet.position), waterBowlFurniture, (furniture) => furniture.model.position);
        
        if(!closestWaterBowlFurniture) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        this.roomPet.actions.free();

        await this.roomPet.path.finishPath();

        this.roomPet.path.walkTo(RoomPositionOffsetData.fromJSON(closestWaterBowlFurniture.model.position), false, this.handleFinishWalk.bind(this, closestWaterBowlFurniture));
    }

    private async handleFinishWalk(waterBowlFurniture: RoomFurniture) {
        this.roomPet.direction = Directions.normalizeDirection((waterBowlFurniture.model.direction ?? 0));

        this.roomPet.sendDirectionEvent();

        if(waterBowlFurniture.model.animation === 0) {
            this.roomPet.sendVocal("THIRSTY");

            return;
        }

        waterBowlFurniture.setAnimation(waterBowlFurniture.model.animation - 1);

        await this.roomPet.addExperiencePoints(5);

        this.roomPet.pose.eat();

        this.roomPet.sendVocal("DRINKING");
    }
}
