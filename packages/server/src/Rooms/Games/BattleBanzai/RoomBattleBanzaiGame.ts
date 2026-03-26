import RoomFurnitureBattleBanzaiGateLogic from "../../Furniture/Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiGateLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomGame, { RoomGamePlayer } from "../RoomGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam } from "./Interfaces/RoomBattleBanzaiGameTeam";

export default class RoomBattleBanzaiGame implements RoomGame<RoomBattleBanzaiGameTeam> {
    public started: boolean = false;
    public paused: boolean = false;

    public gameSeconds: number = 30;

    public starting: boolean = false;
    public startingSeconds: number = 30;

    public get seconds() {
        if(this.starting) {
            return this.startingSeconds;
        }

        return this.gameSeconds;
    }

    public set seconds(value: number) {
        if(this.starting) {
            this.startingSeconds = value;
        }
        else {
            this.gameSeconds = value;
        }
    }

    private players: RoomBattleBanzaiGamePlayer[] = [];

    constructor(private readonly room: Room) {
        
    }

    async startGame(seconds: number): Promise<void> {
        this.gameSeconds = seconds;

        this.started = true;
        this.paused = false;

        this.starting = true;
        this.startingSeconds = 4;
    }

    async endGame(reason: "eliminations" | "counter"): Promise<void> {
        this.started = false;
        this.paused = false;
    }

    async pauseGame(): Promise<void> {
        this.paused = true;
    }

    async resumeGame(): Promise<void> {
        this.paused = false;
    }

    private lastActionInterval = 0;

    async handleActionsInterval() {
        if(!this.started) {
            return;
        }
        
        if(performance.now() - this.lastActionInterval >= 1000) {
            this.lastActionInterval = performance.now();

            this.seconds--;

            if(this.seconds === 0) {
                if(this.starting) {
                    this.starting = false;
                }
                else {
                    await this.endGame("counter");
                }
            }
        }
    }

    public getTeamPlayers(team: RoomBattleBanzaiGameTeam): RoomGamePlayer<RoomBattleBanzaiGameTeam>[] {
        return this.players.filter((player) => player.team === team);
    }

    public addPlayer(roomUser: RoomUser, team: RoomBattleBanzaiGameTeam): void {
        const player: RoomBattleBanzaiGamePlayer = {
            roomUser,
            team
        };

        this.players.push(player);

        roomUser.addAction(this.getTeamAvatarEffect(player));

        for(const furniture of this.getGateFurniture(team)) {
            furniture.setAnimation(this.getTeamPlayers(team).length).catch(console.error);
        }
    }

    public hasPlayer(roomUser: RoomUser): boolean {
        return this.players.some((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public removePlayer(roomUser: RoomUser): void {
        const player = this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);

        if(!player) {
            return;
        }

        this.players.slice(this.players.indexOf(player), 1);

        roomUser.removeAction("AvatarEffect");

        for(const furniture of this.getGateFurniture(player.team)) {
            furniture.setAnimation(this.getTeamPlayers(player.team).length).catch(console.error);
        }
    }
    
    private getTeamAvatarEffect(player: RoomBattleBanzaiGamePlayer) {
        switch(player.team) {
            case "red":
                return "AvatarEffect.33";
                
            case "green":
                return "AvatarEffect.34";
                
            case "blue":
                return "AvatarEffect.35";
                
            case "yellow":
                return "AvatarEffect.36";
        }
    }
    
    private getGateFurniture(team: RoomBattleBanzaiGameTeam) {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBattleBanzaiGateLogic && furniture.logic.team === team);
    }
}
