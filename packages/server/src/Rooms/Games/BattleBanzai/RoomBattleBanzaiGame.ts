import RoomFurnitureBattleBanzaiGateLogic from "../../Furniture/Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiGateLogic";
import RoomFurnitureBattleBanzaiCounterLogic from "../../Furniture/Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiCounterLogic";
import RoomFurnitureBattleBanzaiTileLogic from "../../Furniture/Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiTileLogic";
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

    constructor(public readonly room: Room) {
        
    }
    
    public isPlaying() {
        return this.started && !this.paused && !this.starting;
    }

    async startGame(seconds: number): Promise<void> {
        this.seconds = seconds;

        await Promise.all(
            this.getAllTileFurniture().map((furniture) => furniture.setAnimation(1))
            .concat(this.getAllCounterFurniture().map((furniture) => furniture.setAnimation(0)))
        );

        this.started = true;
        this.paused = false;

        this.starting = true;
        this.startingSeconds = 4;

        this.teams.resetTeams();
    }

    async endGame(reason: "eliminations" | "counter"): Promise<void> {
        this.started = false;
        this.paused = false;
        
        await Promise.all(this.getAllTileFurniture().filter((furniture) => furniture.model.animation === 1).map((furniture) => furniture.setAnimation(0)));
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
    
    public getAllTileFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBattleBanzaiTileLogic);
    }
    
    public getAllCounterFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBattleBanzaiCounterLogic);
    }
}
