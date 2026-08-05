import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredTriggerLogic from "../WiredTriggerLogic";

export default class WiredTriggerScoreAchievedLogic extends WiredTriggerLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleTeamScore(team: string, score: number) {
        this.handleExecution(undefined, team, score);
    }

    public shouldTrigger(options?: WiredTriggerOptions, team?: string, score?: number): boolean {
        if(!this.roomFurniture.model.data?.wiredTriggerScoreAchieved) {
            return false;
        }

        if(this.roomFurniture.model.data.wiredTriggerScoreAchieved.score !== score) {
            return false;
        }

        if(this.roomFurniture.model.data.wiredTriggerScoreAchieved.team !== "any" && this.roomFurniture.model.data.wiredTriggerScoreAchieved.team !== team) {
            return false;
        }

        return true;
    }
}
