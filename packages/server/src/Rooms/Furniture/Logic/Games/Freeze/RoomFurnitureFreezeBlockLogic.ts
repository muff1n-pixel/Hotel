import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomFurniture from "../../../RoomFurniture";

export default class RoomFurnitureFreezeBlockLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {
        this.roomFurniture.setAnimation(0);
    }

    public isWalkable(): boolean {
        return this.roomFurniture.model.animation !== 0;
    }

    public async handleSnowball() {
        await this.roomFurniture.setAnimation(101);

        await new Promise((resolve) => setTimeout(resolve, 500));
     
        await this.roomFurniture.setAnimation(1);
    }

    async handleActionsInterval(): Promise<void> {

    }
}
