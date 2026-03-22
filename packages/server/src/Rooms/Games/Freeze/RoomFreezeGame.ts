import { RoomPositionData } from "@pixel63/events";
import RoomFurnitureFreezeGateLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeGateLogic";
import RoomFurnitureFreezeTileLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeTileLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";

export type RoomFreezeGameTeam = "red" | "green" | "blue" | "yellow";

export type RoomFreezeGamePlayer = {
    team: RoomFreezeGameTeam;
    roomUser: RoomUser;
}

export default class RoomFreezeGame {
    public started: boolean = false;
    public paused: boolean = false;

    public players: RoomFreezeGamePlayer[] = [];
   
    constructor(private readonly room: Room) {

    }

    public async startGame() {
        if(this.started) {
            return;
        } 

        this.started = true;
        this.paused = false;

        for(const furniture of this.getTileFurniture()) {
            await furniture.setAnimation(0);
        }
    }

    public async pauseGame() {
        if(this.paused) {
            return;
        } 

        this.paused = true;
    }

    public async resumeGame() {
        if(!this.paused) {
            return;
        } 

        this.paused = false;
    }

    public async endGame() {
        if(!this.started) {
            return;
        }
        
        this.started = false;
        this.paused = false;

        for(const player of this.getFrozenPlayers()) {
            this.unfreezePlayer(player);
        }
    }

    public async handleActionsInterval() {
        for(const player of this.getFrozenPlayers()) {
            if(performance.now() - player.roomUser.path.frozenAt > 5000) {
                this.unfreezePlayer(player);
            }
        }
    }

    public addPlayer(roomUser: RoomUser, team: RoomFreezeGameTeam) {
        this.players.push({
            roomUser,
            team
        });

        this.updateGateFurniture(team);

        roomUser.addAction(this.getTeamAvatarEffect(team));
    }

    public getPlayer(roomUser: RoomUser) {
        return this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public getPlayerAtPosition(position: RoomPositionData) {
        return this.players.find((player) => player.roomUser.position.row === position.row && player.roomUser.position.column === position.column);
    }

    public removePlayer(roomUser: RoomUser) {
        const player = this.getPlayer(roomUser);
        
        if(player) {
            this.players.splice(this.players.indexOf(player), 1);

            this.updateGateFurniture(player.team);
        }

        roomUser.removeAction("AvatarEffect");
    }

    public getTeamPlayers(team: RoomFreezeGameTeam) {
        return this.players.filter((player) => player.team === team);
    }

    public getFrozenPlayers() {
        return this.players.filter((player) => player.roomUser.path.frozen);
    }

    public freezePlayer(player: RoomFreezeGamePlayer) {
        if(player.roomUser.hasAction("AvatarEffect.12")) {
            return;
        }

        player.roomUser.removeAction("AvatarEffect");
        player.roomUser.addAction("AvatarEffect.12");
        
        player.roomUser.path.setFrozen(true);
    }

    public unfreezePlayer(player: RoomFreezeGamePlayer) {
        player.roomUser.removeAction("AvatarEffect");

        player.roomUser.addAction(this.getTeamAvatarEffect(player.team));

        player.roomUser.path.setFrozen(false);
    }

    private updateGateFurniture(team: RoomFreezeGameTeam) {
        const teamPlayers = this.getTeamPlayers(team);

        for(const furniture of this.getGateFurniture(team)) {
            furniture.setAnimation(teamPlayers.length);
        }
    }

    private getGateFurniture(team: RoomFreezeGameTeam) {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeGateLogic && furniture.logic.team === team);
    }

    private getTileFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeTileLogic);
    }

    private getTeamAvatarEffect(team: RoomFreezeGameTeam) {
        switch(team) {
            case "red":
                return "AvatarEffect.40";
                
            case "green":
                return "AvatarEffect.41";
                
            case "blue":
                return "AvatarEffect.42";
                
            case "yellow":
                return "AvatarEffect.43";
        }
    }
}
