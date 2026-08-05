import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import { RoomGameConstructor } from "../../../../Games/RoomGame";
import RoomBattleBanzaiGame from "../../../../Games/BattleBanzai/RoomBattleBanzaiGame";
import RoomFreezeGame from "../../../../Games/Freeze/RoomFreezeGame";

export default class WiredActionGiveScoreTeamLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionGiveScoreTeam) {
            return;
        }

        const gameConstructor = this.getGameConstructor();

        if(!gameConstructor) {
            return;
        }

        const game = this.roomFurniture.room.games.getGame(gameConstructor);

        if(!game) {
            return;
        }

        if(this.roomFurniture.model.data.wiredActionGiveScoreTeam.action === "add") {
            game.giveTeamScore(this.roomFurniture.model.data.wiredActionGiveScoreTeam.team, this.roomFurniture.model.data.wiredActionGiveScoreTeam.score);
        }
        else if(this.roomFurniture.model.data.wiredActionGiveScoreTeam.action === "remove") {
            game.removeTeamScore(this.roomFurniture.model.data.wiredActionGiveScoreTeam.team, this.roomFurniture.model.data.wiredActionGiveScoreTeam.score);
        }

        await this.setActive();
    }
    
    private getGameConstructor(): RoomGameConstructor | null {
        switch(this.roomFurniture.model.data?.wiredActionJoinTeam?.game) {
            case "battle_banzai":
                return RoomBattleBanzaiGame;

            case "freeze":
                return RoomFreezeGame;
        }

        return null;
    }
}
