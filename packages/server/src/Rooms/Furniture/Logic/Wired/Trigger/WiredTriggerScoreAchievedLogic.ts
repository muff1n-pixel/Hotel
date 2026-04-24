import RoomFurniture from "../../../RoomFurniture";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerScoreAchievedLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleTeamScore(team: string, score: number) {
        if(!this.roomFurniture.model.data?.wiredTriggerScoreAchieved) {
            return;
        }

        if(this.roomFurniture.model.data.wiredTriggerScoreAchieved.score !== score) {
            return;
        }

        if(this.roomFurniture.model.data.wiredTriggerScoreAchieved.team !== "any" && this.roomFurniture.model.data.wiredTriggerScoreAchieved.team !== team) {
            return;
        }

        await this.setActive();
        
        await this.handleTrigger();
    }
}
