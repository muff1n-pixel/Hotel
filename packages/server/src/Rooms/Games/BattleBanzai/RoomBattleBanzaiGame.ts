import RoomFurnitureBattleBanzaiGateLogic from "../../Furniture/Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiGateLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomGame, { RoomGamePlayer } from "../RoomGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam } from "./Interfaces/RoomBattleBanzaiGameTeam";
import RoomBattleBanzaiGamePlayers from "./RoomBattleBanzaiGamePlayers";

export default class RoomBattleBanzaiGame implements RoomGame<RoomBattleBanzaiGameTeam> {
    public started: boolean = false;
    public paused: boolean = false;

    public gameSeconds: number = 30;

    public starting: boolean = false;
    public startingSeconds: number = 30;

    public players = new RoomBattleBanzaiGamePlayers(this);

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

    public getTeamAvatarEffect(player: RoomBattleBanzaiGamePlayer) {
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
    
    public getGateFurniture(team: RoomBattleBanzaiGameTeam) {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBattleBanzaiGateLogic && furniture.logic.team === team);
    }
}
