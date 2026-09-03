import { RoomPetsData, RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../Helpers/Directions";
import RoomFurniturePetNestLogic from "../../Furniture/Logic/RoomFurniturePetNestLogic";
import RoomPet from "../RoomPet";
import RoomPetAction from "./Interfaces/RoomPetAction";
import RoomFurniture from "../../Furniture/RoomFurniture";
import RoomPetFreeAction from "./RoomPetFreeAction";
import { logger } from "../../../RoomLogger";

export default class RoomPetNestAction implements RoomPetAction {
    private isInNest: boolean = false;
    private attemptsToReachNest: number = 0;

    private lastEnergyTimestamp: number = performance.now();

    constructor(private readonly roomPet: RoomPet) {
        this.roomPet.pose.jump();
    }

    async handleActionsInterval(): Promise<void> {
        if(!this.isInNest) {
            if(this.roomPet.path.path) {
                return;
            }

            const nestFurniture = this.getClosestNest();

            if(!nestFurniture) {
                logger.debug("No pet nests exists in the room.");

                this.roomPet.action = new RoomPetFreeAction(this.roomPet);

                return;
            }

            if(nestFurniture.isPositionInside(RoomPositionOffsetData.fromJSON(this.roomPet.position))) {
                this.isInNest = true;

                return;
            }

            this.roomPet.path.walkTo(RoomPositionOffsetData.fromJSON(nestFurniture.model.position), false, () => {
                this.isInNest = true;

                this.roomPet.pose.lay();
            }, () => {
                this.attemptsToReachNest++;

                if(this.attemptsToReachNest >= 5) {
                    this.roomPet.action = new RoomPetFreeAction(this.roomPet);
                }
            });

            return;
        }

        if(performance.now() - this.lastEnergyTimestamp > 5000) {
            this.roomPet.model.energy += 5;
            this.roomPet.model.save();

            this.roomPet.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
                petsUpdated: [
                    this.roomPet.getPetData()
                ]
            }));

            this.lastEnergyTimestamp = performance.now();
        }
    }

    private getClosestNest(): RoomFurniture | null {
        const nestFurniture = this.roomPet.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurniturePetNestLogic);

        const closestNestFurniture = Directions.getClosestPosition(RoomPositionOffsetData.fromJSON(this.roomPet.position), nestFurniture, (furniture) => furniture.model.position);
        
        return closestNestFurniture;
    }
}
