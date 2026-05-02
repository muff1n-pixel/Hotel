import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";
import RoomBattleBanzaiGame from "../../../../Games/BattleBanzai/RoomBattleBanzaiGame";
import RoomFreezeGame from "../../../../Games/Freeze/RoomFreezeGame";
import { RoomGameConstructor } from "../../../../Games/RoomGame";

export default class WiredActionJoinTeamLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionJoinTeam) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        const gameConstructor = this.getGameConstructor();

        if(!gameConstructor) {
            return;
        }

        const game = this.roomFurniture.room.games.getOrAddGame(gameConstructor);

        game.players.addPlayer(options.roomUser, this.roomFurniture.model.data.wiredActionJoinTeam.team);

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
