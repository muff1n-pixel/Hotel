import RoomFurnitureFreezeGateLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeGateLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";

export type RoomFreezeGameTeam = "red" | "green" | "blue" | "yellow";

export type RoomFreezeGamePlayer = {
    team: RoomFreezeGameTeam;
    roomUser: RoomUser;
}

export default class RoomFreezeGame {
    public started: boolean = false;
    public players: RoomFreezeGamePlayer[] = [];
   
    constructor(private readonly room: Room) {

    }

    public async startGame() {
        if(this.started) {
            return;
        } 

        this.started = true;
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

    public removePlayer(roomUser: RoomUser) {
        const player = this.getPlayer(roomUser);
        
        if(player) {
            this.players.splice(this.players.indexOf(player), 1);

            this.updateGateFurniture(player.team);
        }

        roomUser.removeAction("AvatarEffect");
    }

    public async endGame() {
        if(!this.started) {
            return;
        }
        
        this.started = false;
    }

    public getTeamPlayers(team: RoomFreezeGameTeam) {
        return this.players.filter((player) => player.team === team);
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
