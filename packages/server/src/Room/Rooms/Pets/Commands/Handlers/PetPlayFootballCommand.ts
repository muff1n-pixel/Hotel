import { RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../../Helpers/Directions";
import RoomFurnitureFootballLogic from "../../../Furniture/Logic/Games/RoomFurnitureFootballLogic";
import RoomUser from "../../../Users/RoomUser";
import { RoomPetState } from "../../RoomPet";
import PetCommand from "../PetCommand";
import RoomFurniture from "../../../Furniture/RoomFurniture";

export default class PetPlayFootballCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.actions.state === RoomPetState.PLAY_FOOTBALL) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        if(this.roomPet.model.energy < 10) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }
        
        const footballFurniture = this.roomPet.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFootballLogic);

        const closestFootballFurniture = Directions.getClosestPosition(RoomPositionOffsetData.fromJSON(this.roomPet.position), footballFurniture, (furniture) => furniture.model.position);
        
        if(!closestFootballFurniture) {
            this.roomPet.sendVocal("UNKNOWN_COMMAND");

            return;
        }

        this.roomPet.actions.state = RoomPetState.PLAY_FOOTBALL;

        await this.roomPet.path.finishPath();

        this.roomPet.path.walkTo(RoomPositionOffsetData.fromJSON(closestFootballFurniture.model.position), false, this.handleFinishWalk.bind(this, closestFootballFurniture), this.handleCancelledWalk.bind(this));
    }
    
    private async handleFinishWalk(closestFootballFurniture: RoomFurniture) {
        await this.roomPet.addExperiencePoints(10, 10);

        this.roomPet.sendVocal("PLAYFUL");

        this.roomPet.actions.free();
    }

    private async handleCancelledWalk() {
        this.roomPet.actions.free();
    }
}
