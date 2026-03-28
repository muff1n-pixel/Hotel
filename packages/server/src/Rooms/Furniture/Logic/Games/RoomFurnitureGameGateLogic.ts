import { UseRoomFurnitureData } from "@pixel63/events";
import RoomFurniture from "../../RoomFurniture";
import RoomFurnitureLogic from "../Interfaces/RoomFurnitureLogic";
import RoomGame, { RoomGameConstructor } from "../../../Games/RoomGame";
import RoomUser from "../../../Users/RoomUser";

export default class RoomFurnitureGameGateLogic<T> implements RoomFurnitureLogic {
    constructor(public readonly roomFurniture: RoomFurniture, public readonly team: T, public readonly game: RoomGameConstructor) {
        this.roomFurniture.setAnimation(0).catch(console.error);
    }

    public isWalkable(): boolean {
        if(this.roomFurniture.room.games.isGamePlaying(this.game)) {
            return false;
        }

        const game = this.roomFurniture.room.games.getGame(this.game);

        if(game && game.players.getTeamPlayers(this.team).length >= 5) {
            return false;
        }

        return true;
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        const game = this.roomFurniture.room.games.getOrAddGame(this.game);

        const isExistingPlayer = game.players.hasPlayer(roomUser);

        if(isExistingPlayer) {
            game.players.removePlayer(roomUser);
        }
        else {
            if(game.players.getTeamPlayers(this.team).length >= 5) {
                return;
            }

            game.players.addPlayer(roomUser, this.team);
        }
    }
}
