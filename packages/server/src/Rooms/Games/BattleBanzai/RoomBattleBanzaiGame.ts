import RoomFurnitureBattleBanzaiGateLogic from "../../Furniture/Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiGateLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomGame, { RoomGamePlayer } from "../RoomGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam } from "./Interfaces/RoomBattleBanzaiGameTeam";
import RoomBattleBanzaiGamePlayers from "./RoomBattleBanzaiGamePlayers";
import RoomBattleBanzaiGameTeams from "./RoomBattleBanzaiGameTeams";

export default class RoomBattleBanzaiGame implements RoomGame<RoomBattleBanzaiGameTeam> {
    public started: boolean = false;
    public paused: boolean = false;

    public seconds: number = 30;

    public starting: boolean = false;
    public startingSeconds: number = 3;

    public players = new RoomBattleBanzaiGamePlayers(this);
    
    public teams = new RoomBattleBanzaiGameTeams(this);

    constructor(private readonly room: Room) {
        
    }

    async startGame(seconds: number): Promise<void> {
        this.seconds = seconds;

        this.started = true;
        this.paused = false;

        this.starting = true;
        this.startingSeconds = 4;

        this.teams.resetTeams();
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

            if(this.starting) {
                this.startingSeconds--;

                if(this.startingSeconds === 0)  {
                    this.starting = false;
                }
            }
            else {
                this.seconds--;

                if(this.seconds === 0) {
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
