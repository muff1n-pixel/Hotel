import RoomUser from "../../../Users/RoomUser";
import RoomFurniture from "../../RoomFurniture";
import WiredActionLogic from "./WiredActionLogic";
import WiredConditionLogic from "./WiredConditionLogic";
import WiredLogic, { WiredTriggerOptions } from "./WiredLogic";

export default class WiredTriggerLogic extends WiredLogic {
    handleBeforeUserWalksOnFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    handleUserWalksOnFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    
    handleBeforeUserWalksOffFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    handleUserWalksOffFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;

    shouldTrigger(options?: WiredTriggerOptions): boolean {
        return false;
    };
    
    public async handleTrigger(options?: WiredTriggerOptions, ...args: any[]) {
        await this.setActive();

        const wiredStackFurniture = this.roomFurniture.room.furnitures.filter((furniture) =>
            furniture.model.position.row === this.roomFurniture.model.position.row
            && furniture.model.position.column === this.roomFurniture.model.position.column
        );

        const wiredStackConditionFurniture = wiredStackFurniture.filter((furniture) => furniture.logic instanceof WiredConditionLogic);

        for(const conditionFurniture of wiredStackConditionFurniture) {
            const logic = conditionFurniture.logic as WiredConditionLogic;

            const result = await logic.handleCondition?.(options);

            if(!result) {
                return;
            }

            await logic.setActive();
        }

        const wiredStackActionFurniture = wiredStackFurniture.filter((furniture) => furniture.logic instanceof WiredActionLogic);

        await Promise.all(wiredStackActionFurniture.map(async (furniture) => {
            const logic = furniture.logic as WiredActionLogic;

            await logic.handleTrigger?.(options);
        }));
    }

    public handleExecution(options?: WiredTriggerOptions, ...args: any[]) {
        this.roomWired.startExecution(
            new Promise<void>((resolve, reject) => {
                if(!this.shouldTrigger(options)) {
                    return resolve();
                }

                this.handleTrigger(options, ...args)
                    .then(resolve)
                    .catch(reject);
            })
        )
            .catch(console.error);
    }
}