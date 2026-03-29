import RoomUser from "../../../Users/RoomUser";
import RoomFurniture from "../../RoomFurniture";
import WiredActionLogic from "./WiredActionLogic";
import WiredLogic, { WiredTriggerOptions } from "./WiredLogic";

export default class WiredTriggerLogic extends WiredLogic {
    handleBeforeUserWalksOnFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    handleUserWalksOnFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    
    handleBeforeUserWalksOffFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    handleUserWalksOffFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    
    public async handleTrigger(options?: WiredTriggerOptions) {
        const wiredStackFurniture = this.roomFurniture.room.furnitures.filter((furniture) =>
            furniture.model.position.row === this.roomFurniture.model.position.row
            && furniture.model.position.column === this.roomFurniture.model.position.column
        );

        const wiredStackActionFurniture = wiredStackFurniture.filter((furniture) => furniture.logic instanceof WiredActionLogic);

        await Promise.all(wiredStackActionFurniture.map(async (furniture) => {
            const logic = furniture.logic as WiredActionLogic;

            await logic.handleAction?.(options);
        }));
    }
}