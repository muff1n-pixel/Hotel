import RoomFurniture from "../../../RoomFurniture";
import { WiredTriggerOptions } from "../WiredLogic";
import WiredActionLogic from "../WiredActionLogic";

export default class WiredActionLeaveTeamLogic extends WiredActionLogic {
    constructor(roomFurniture: RoomFurniture) {
        super(roomFurniture);
    }

    public async handleAction(options?: WiredTriggerOptions): Promise<void> {
        if(!options?.roomUser) {
            return;
        }

        for(const game of this.roomFurniture.room.games.getAllGames()) {
            game.players.removePlayer(options.roomUser);
        }

        await this.setActive();
    }
}
