import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";
import { RoomFreezeGameTeam } from "../../../../Games/Freeze/RoomFreezeGame.js";

export default class RoomFurnitureFreezeGateLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture, public readonly team: RoomFreezeGameTeam) {
        this.roomFurniture.setAnimation(
            this.roomFurniture.room.freezeGame.getTeamPlayers(this.team).length
        ).catch(console.error);
    }

    public isWalkable(): boolean {
        if(this.roomFurniture.room.freezeGame.started) {
            return false;
        }

        if(this.roomFurniture.room.freezeGame.getTeamPlayers(this.team).length >= 5) {
            return false;
        }

        return true;
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }

    async handleUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        const isExistingPlayer = this.roomFurniture.room.freezeGame.getPlayer(roomUser);

        if(isExistingPlayer) {
            this.roomFurniture.room.freezeGame.removePlayer(roomUser);
        }
        else {
            if(this.roomFurniture.room.freezeGame.getTeamPlayers(this.team).length >= 5) {
                return;
            }

            this.roomFurniture.room.freezeGame.addPlayer(roomUser, this.team);
        }
    }
}
