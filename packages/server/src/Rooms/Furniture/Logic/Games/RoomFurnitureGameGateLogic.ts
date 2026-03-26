import { UseRoomFurnitureData } from "@pixel63/events";
import RoomFurniture from "../../RoomFurniture";
import RoomFurnitureLogic from "../Interfaces/RoomFurnitureLogic";
import RoomGame from "../../../Games/RoomGame";
import RoomUser from "../../../Users/RoomUser";

export default class RoomFurnitureGameGateLogic<T> implements RoomFurnitureLogic {
    constructor(public readonly roomFurniture: RoomFurniture, public readonly team: T) {
        this.roomFurniture.setAnimation(
            this.getGame().players.getTeamPlayers(this.team).length
        ).catch(console.error);
    }

    public getGame(): RoomGame<T> {
        throw new Error("Not implemented");
    }

    public isWalkable(): boolean {
        if(this.getGame().started) {
            return false;
        }

        if(this.getGame().players.getTeamPlayers(this.team).length >= 5) {
            return false;
        }

        return true;
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        const isExistingPlayer = this.getGame().players.hasPlayer(roomUser);

        if(isExistingPlayer) {
            this.getGame().players.removePlayer(roomUser);
        }
        else {
            if(this.getGame().players.getTeamPlayers(this.team).length >= 5) {
                return;
            }

            this.getGame().players.addPlayer(roomUser, this.team);
        }
    }
}
