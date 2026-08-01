import { UseRoomFurnitureData } from "@pixel63/events";
import RoomFootballGame from "../../../../Games/Football/RoomFootballGame.js";
import { RoomGameConstructor } from "../../../../Games/RoomGame.js";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureFootballGateLogic implements RoomFurnitureLogic {
    public readonly game: RoomGameConstructor = RoomFootballGame;

    constructor(public readonly roomFurniture: RoomFurniture) {
    }

    public isWalkable(): boolean {
        if(this.roomFurniture.room.games.isGamePlaying(this.game)) {
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
            game.players.addPlayer(roomUser);

            if(roomUser.user.model.figureConfiguration.gender === "male" && this.roomFurniture.model.data?.common?.maleFigureConfiguration) {
                roomUser.setTemporaryFigureConfiguration(this.roomFurniture.model.data?.common?.maleFigureConfiguration, true);
            }
            else if(roomUser.user.model.figureConfiguration.gender === "female" && this.roomFurniture.model.data?.common?.femaleFigureConfiguration) {
                roomUser.setTemporaryFigureConfiguration(this.roomFurniture.model.data?.common?.femaleFigureConfiguration, true);
            }
        }
    }
}