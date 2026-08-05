import { WidgetNotificationData } from "@pixel63/events";
import Room from "../../Room";
import RoomGame from "../RoomGame";
import { RoomFootballGameTeam } from "./Interfaces/RoomFootballGameTeam";
import RoomFootballGamePlayers from "./RoomFootballGamePlayers";
import RoomFootballGameTeams from "./RoomFootballGameTeams";
import BattleBanzaiGameNotifications from "../../../../Game/Users/Notifications/Games/BattleBanzaiGameNotifications";
import { game } from "../../../../Game";
import RoomFurnitureFootballCounterLogic from "../../Furniture/Logic/Games/Football/RoomFurnitureFootballCounterLogic";
import FootballGameNotifications from "../../../../Game/Users/Notifications/Games/FootballGameNotifications";

export default class RoomFootballGame implements RoomGame<RoomFootballGameTeam> {
    public started: boolean = false;
    public paused: boolean = false;
    public ending: boolean = false;

    public seconds: number = 30;

    public players = new RoomFootballGamePlayers(this);
    
    public teams = new RoomFootballGameTeams(this);

    constructor(public readonly room: Room) {
        
    }
    
    public isPlaying() {
        return this.started && !this.paused;
    }

    async startGame(seconds: number): Promise<void> {
        if(this.started) {
            return;
        }

        this.seconds = seconds;

        await this.room.setBulkFurnitureAnimations(
            this.getAllCounterFurniture().map((furniture) => {
                return {
                    furniture,
                    animation: 0
                }
            })
        );

        this.started = true;
        this.paused = false;

        this.players.resetPlayerScores();
        this.teams.resetTeams();
        
        for(const player of this.players.getAllPlayers()) {
            player.roomUser.user.sendProtobuff(WidgetNotificationData, FootballGameNotifications.buildGameStarted());
        }
    }

    async endGame(reason: "eliminations" | "counter"): Promise<void> {
        if(!this.started) {
            return;
        }

        this.started = false;
        this.paused = false;

        game.getUserAchievements(this.room.model.owner.id).addAchievementScore("GameArcadeOwner", this.teams.getAllTeams().reduce((score, team) => team.score + score, 0)).catch(console.error);
        game.getUserAchievements(this.room.model.owner.id).addAchievementScore("FootballGoalHost", this.teams.getAllTeams().reduce((score, team) => team.score + score, 0)).catch(console.error);

        const winningTeam = this.teams.getTeamWithMostScore();

        if(winningTeam) {
            this.ending = true;
        }

        for(const player of this.players.getAllPlayers()) {
            player.roomUser.user.sendProtobuff(WidgetNotificationData, FootballGameNotifications.buildGameEnded(reason, winningTeam?.team ?? null, winningTeam?.score));
        }

        await this.room.handleGameEnds(this);
    }

    async pauseGame(): Promise<void> {
        this.paused = true;
    }

    async resumeGame(): Promise<void> {
        this.paused = false;
    }

    private lastActionInterval = 0;

    async handleActionsInterval() {
        if(this.ending) {
            const winningTeam = this.teams.getTeamWithMostScore();

            if(!winningTeam) {
                return;
            }

            this.ending = false;

            return;
        }

        if(!this.started) {
            return;
        }

        if(performance.now() - this.lastActionInterval >= 1000) {
            this.lastActionInterval = performance.now();


            this.seconds--;

            if(this.seconds === 0) {
                await this.endGame("counter");
            }
        }
    }
    
    public getAllCounterFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFootballCounterLogic);
    }
    
    public giveTeamScore(team: RoomFootballGameTeam, score: number): void {
        this.teams.addTeamScore(team, score);
    }

    public removeTeamScore(team: RoomFootballGameTeam, score: number): void {
        this.teams.removeTeamScore(team, score);
    }
}
