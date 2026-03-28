import { WidgetNotificationData } from "@pixel63/events";
import RoomFurnitureBattleBanzaiGateLogic from "../../Furniture/Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiGateLogic";
import RoomFurnitureBattleBanzaiCounterLogic from "../../Furniture/Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiCounterLogic";
import RoomFurnitureBattleBanzaiTileLogic from "../../Furniture/Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiTileLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomGame, { RoomGamePlayer } from "../RoomGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam, RoomBattleBanzaiGameTeamData } from "./Interfaces/RoomBattleBanzaiGameTeam";
import RoomBattleBanzaiGamePlayers from "./RoomBattleBanzaiGamePlayers";
import RoomBattleBanzaiGameTeams from "./RoomBattleBanzaiGameTeams";
import BattleBanzaiGameNotifications from "../../../Users/Notifications/Games/BattleBanzaiGameNotifications";

export default class RoomBattleBanzaiGame implements RoomGame<RoomBattleBanzaiGameTeam> {
    public started: boolean = false;
    public paused: boolean = false;
    public ending: boolean = false;
    private endingWinningTeam?: RoomBattleBanzaiGameTeamData;

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
        if(this.started) {
            return;
        }

        this.seconds = seconds;

        await this.room.setBulkFurnitureAnimations(
            this.getAllTileFurniture().map((furniture) => {
                (furniture.logic as RoomFurnitureBattleBanzaiTileLogic).locked = false;

                return {
                    furniture,
                    animation: 1
                };
            })
            .concat(this.getAllCounterFurniture().map((furniture) => {
                return {
                    furniture,
                    animation: 0
                }
            }))
        );

        this.started = true;
        this.paused = false;

        this.starting = true;
        this.startingSeconds = 4;

        this.teams.resetTeams();
    }

    async endGame(reason: "eliminations" | "counter"): Promise<void> {
        if(!this.started) {
            return;
        }

        this.started = false;
        this.paused = false;

        const winningTeam = this.teams.getTeamWithMostScore();

        if(winningTeam) {
            this.ending = true;
            this.startingSeconds = 8;
        }

        for(const player of this.players.getAllPlayers()) {
            const playerTeam = this.teams.getTeam(player.team);
            
            if(playerTeam) {
                player.roomUser.user.achievements.addAchievementScore("BattleBanzaiPlayer", playerTeam.score).catch(console.error);

                if(playerTeam.team === winningTeam?.team) {
                    player.roomUser.user.achievements.addAchievementScore("BattleBanzaiStar", playerTeam.score).catch(console.error);
                    player.roomUser.user.achievements.addAchievementScore("Player", playerTeam.score).catch(console.error);
                }
            }

            player.roomUser.user.sendProtobuff(WidgetNotificationData, BattleBanzaiGameNotifications.buildGameEnded(reason, winningTeam?.team ?? null, winningTeam?.score));
        }
        
        await this.room.setBulkFurnitureAnimations(
            this.getAllTileFurniture().filter((furniture) => furniture.model.animation === 1).map((furniture) => {
                (furniture.logic as RoomFurnitureBattleBanzaiTileLogic).locked = false;

                return {
                    furniture,
                    animation: 0
                };
            })
        );
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

            const teamAnimationId = ["red", "green", "blue", "yellow"].indexOf(winningTeam.team);

            const teamStartAnimationId = 3 + (teamAnimationId * 3);
            const teamFinishAnimationId = teamStartAnimationId + 2;

            const lockedWinningTeamTiles = this.getAllTileFurniture().filter((furniture) => (furniture.logic as RoomFurnitureBattleBanzaiTileLogic).lockedTeam === winningTeam.team);

            await this.room.setBulkFurnitureAnimations(
                lockedWinningTeamTiles.map((furniture) => {
                    return {
                        furniture,
                        animation: (((this.startingSeconds % 2) === 0))?(0):(teamFinishAnimationId)
                    };
                })
            );

            this.startingSeconds--;

            if(this.startingSeconds === 0) {
                this.ending = false;
            }

            return;
        }

        if(!this.started) {
            return;
        }

        const allTiles = this.getAllTileFurniture().length;
        const allLockedTiles = this.teams.getAllTeams().reduce((score, team) => team.score + score, 0);

        if(allLockedTiles === allTiles) {
            await this.endGame("eliminations");

            return;
        }
        
        if(performance.now() - this.lastActionInterval >= 1000) {
            this.lastActionInterval = performance.now();

            if(this.starting) {
                this.startingSeconds--;

                if(this.startingSeconds === 0)  {
                    this.starting = false;

                    for(const player of this.players.getAllPlayers()) {
                        player.roomUser.user.sendProtobuff(WidgetNotificationData, BattleBanzaiGameNotifications.buildGameStarted());
                    }
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
