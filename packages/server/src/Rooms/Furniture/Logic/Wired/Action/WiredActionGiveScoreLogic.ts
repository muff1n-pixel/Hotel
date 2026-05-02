import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";

export default class WiredActionGiveScoreLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!this.roomFurniture.model.data?.wiredActionGiveScore) {
            return;
        }

        if(!options?.roomUser) {
            return;
        }

        for(const game of this.roomFurniture.room.games.getAllGames()) {
            if(!game.players.hasPlayer(options.roomUser)) {
                continue;
            }

            if(this.roomFurniture.model.data.wiredActionGiveScore.action === "add") {
                game.players.givePlayerScore(options.roomUser, this.roomFurniture.model.data.wiredActionGiveScore.score);
            }
            else if(this.roomFurniture.model.data.wiredActionGiveScore.action === "remove") {
                game.players.removePlayerScore(options.roomUser, this.roomFurniture.model.data.wiredActionGiveScore.score);
            }
        }

        await this.setActive();
    }
}
