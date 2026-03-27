import { RoomPositionData, RoomPositionOffsetData, RoomUserData, WidgetNotificationData } from "@pixel63/events";
import RoomFurnitureFreezeGateLogic from "../../Furniture/Logic/Games/Freeze/Common/RoomFurnitureFreezeGateLogic";
import RoomFurnitureFreezeTileLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeTileLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomFurnitureFreezeBlockLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeBlockLogic";
import RoomFurnitureFreezeExitLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeExitLogic";
import RoomFurnitureFreezeCounterLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeCounterLogic";
import { randomUUID } from "crypto";
import UserFreezeGameNotifications from "../../../Users/Notifications/Games/UserFreezeGameNotifications";
import RoomGame from "../RoomGame";
import RoomFreezeGamePlayers from "./RoomFreezeGamePlayers";

export type RoomFreezeGameTeam = "red" | "green" | "blue" | "yellow";

export type RoomFreezeGamePlayer = {
    team: RoomFreezeGameTeam;
    roomUser: RoomUser;
    health: number;
    
    radius: number;
    
    shield: boolean;
    shieldAt: number;

    crossBlast: boolean;

    maxSnowballs: number;
    currentSnowballs: number;
    
    megaSnowball: boolean;
}

export type RoomFreezeGameTeamData = {
    score: number;
};

export enum RoomFreezeGamePowerups {
    BiggerBomb = 2,
    MorePower = 3,
    CrossBlast = 4,
    MegaSnowball = 5,
    ExtraLife = 6,
    Shield = 7,
};

export default class RoomFreezeGame implements RoomGame<RoomFreezeGameTeam> {
    public started: boolean = false;
    public paused: boolean = false;
    public seconds: number = 30;

    public players = new RoomFreezeGamePlayers(this);

    public teams: Record<RoomFreezeGameTeam, RoomFreezeGameTeamData> = {
        red: {
            score: 0
        },
        green: {
            score: 0
        },
        blue: {
            score: 0
        },
        yellow: {
            score: 0
        }
    };
   
    constructor(public readonly room: Room) {

    }

    public async startGame(seconds: number) {
        if(this.started) {
            return;
        } 

        this.seconds = seconds;

        this.started = true;
        this.paused = false;

        this.teams.red.score = 0;
        this.teams.green.score = 0;
        this.teams.blue.score = 0;
        this.teams.yellow.score = 0;

        for(const player of this.players.getAllPlayers()) {
            player.health = 3;
            player.radius = 3;
            player.shield = false;
            player.shieldAt = 0;
            player.crossBlast = false;
            player.megaSnowball = false;
            
            player.currentSnowballs = 0;
            player.maxSnowballs = 1;

            this.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                id: player.roomUser.user.model.id,

                updateHealth: true,
                health: player.health
            }));

            player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                id: randomUUID(),
                text: `The game of Freeze has started, eliminate the enemy teams to win!`,
                imageUrl: `/assets/widgets/freeze/team_${player.team}.png`
            }));
        }

        const exitFurniture = this.getExitFurniture();

        await this.room.setBulkFurnitureAnimations(
            this.getTileFurniture().map((furniture) => {
                if(exitFurniture) {
                    const actors = this.room.getActorsAtPosition(RoomPositionOffsetData.fromJSON(furniture.model.position));

                    for(const actor of actors) {
                        if(actor instanceof RoomUser && !this.players.hasPlayer(actor)) {
                            actor.removeAction("AvatarEffect");
                            actor.addAction("AvatarEffect.4", 1000);

                            actor.path.teleportTo(RoomPositionOffsetData.fromJSON(exitFurniture.model.position));
                        }
                    }
                }

                return {
                    furniture,
                    animation: 0
                };
            })
            .concat(
                this.getAllExitFurniture().map((furniture) => {
                    return {
                        furniture,
                        animation: 1
                    }
                })
            )
            .concat(
                this.getBoxFurniture().map((furniture) => {
                    if(this.room.getRoomUserAtPosition(RoomPositionOffsetData.fromJSON(furniture.model.position))) {
                        return {
                            furniture,
                            animation: 1
                        };
                    }

                    return {
                        furniture,
                        animation: 0
                    };
                })
            )
        );

        await Promise.all(
            this.getAllCounterFurniture().map((furniture) => (furniture.logic as RoomFurnitureFreezeCounterLogic).updateAnimationTags(0))
        );
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

    public async endGame(reason: "counter" | "eliminations") {
        if(!this.started) {
            return;
        }
        
        this.started = false;
        this.paused = false;

        const winnerTeam = this.getTeamWithMostScore();

        for(const player of this.players.getAllPlayers()) {
            player.roomUser.user.achievements.addAchievementScore("FreezePlayer", this.teams[player.team].score).catch(console.error);

            if(player.team === winnerTeam) {
                player.roomUser.user.achievements.addAchievementScore("FreezeWinner", this.teams[player.team].score).catch(console.error);
            }

            this.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                id: player.roomUser.user.model.id,

                updateHealth: true,
                health: null
            }));

            player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildGameEnded(reason, winnerTeam, (winnerTeam)?(this.teams[winnerTeam].score):(undefined)));
        }

        for(const player of this.players.getFrozenPlayers()) {
            this.players.unfreezePlayer(player);
        }

        await Promise.all(this.getAllExitFurniture().map((furniture) => furniture.setAnimation(0)));
    }

    private lastActionInterval: number = 0;

    public async handleActionsInterval() {
        if(!this.started || this.paused) {
            return;
        }

        for(const player of this.players.getAllPlayers()) {
            if(player.shield && performance.now() - player.shieldAt >= 5000) {
                player.shield = false;
                
                player.roomUser.removeAction("AvatarEffect");
                player.roomUser.addAction(this.getTeamAvatarEffect(player));
            }

            if(player.roomUser.path.frozen) {
                if(performance.now() - player.roomUser.path.frozenAt >= 5000) {
                    this.players.unfreezePlayer(player);

                    if(player.health === 0) {
                        const exitFurniture = this.getExitFurniture();

                        if(exitFurniture) {
                            this.players.removePlayer(player.roomUser);

                            player.roomUser.removeAction("AvatarEffect");
                            player.roomUser.addAction("AvatarEffect.4", 1000);

                            player.roomUser.path.teleportTo(RoomPositionOffsetData.fromJSON(exitFurniture.model.position));
                            
                            player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPlayerEliminated());
                        }
                    }
                }
            }
        }

        if(performance.now() - this.lastActionInterval >= 1000) {
            this.lastActionInterval = performance.now();

            this.seconds--;

            if(this.seconds === 0) {
                await this.endGame("counter");
            }
        }
    }

    public givePlayerPowerup(player: RoomFreezeGamePlayer, powerup: RoomFreezeGamePowerups) {
        player.roomUser.user.achievements.addAchievementScore("FreezePowerUpper", 1).catch(console.error);
        
        switch(powerup) {
            case RoomFreezeGamePowerups.ExtraLife: {
                if(player.health < 5) {
                    player.health++;

                    this.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                        id: player.roomUser.user.model.id,

                        updateHealth: true,
                        health: player.health
                    }));

                    player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPickedUpPowerUp(powerup));
                }

                break;
            }

            case RoomFreezeGamePowerups.BiggerBomb: {
                player.radius++;

                player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPickedUpPowerUp(powerup));

                break;
            }

            case RoomFreezeGamePowerups.Shield: {
                player.shield = true;
                player.shieldAt = performance.now();
                
                player.roomUser.removeAction("AvatarEffect");
                player.roomUser.addAction(this.getTeamAvatarEffect(player));

                player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPickedUpPowerUp(powerup));

                break;
            }

            case RoomFreezeGamePowerups.CrossBlast: {
                player.crossBlast = true;

                player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPickedUpPowerUp(powerup));

                break;
            }

            case RoomFreezeGamePowerups.MorePower: {
                player.maxSnowballs++;

                player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPickedUpPowerUp(powerup));

                break;
            }

            case RoomFreezeGamePowerups.MegaSnowball: {
                player.megaSnowball = true;

                player.roomUser.user.notifications.sendNotification(UserFreezeGameNotifications.buildPickedUpPowerUp(powerup));

                break;
            }
        }
    }

    public updateGateFurniture(team: RoomFreezeGameTeam) {
        const teamPlayers = this.players.getTeamPlayers(team);

        for(const furniture of this.getGateFurniture(team)) {
            furniture.setAnimation(teamPlayers.length).catch(console.error);
        }
    }

    private getGateFurniture(team: RoomFreezeGameTeam) {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeGateLogic && furniture.logic.team === team);
    }

    private getAllExitFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeExitLogic);
    }

    private getExitFurniture() {
        const allFurniture = this.getAllExitFurniture();

        return allFurniture[Math.floor(Math.random() * allFurniture.length)];
    }

    private getTileFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeTileLogic);
    }

    private getBoxFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeBlockLogic);
    }

    private getAllCounterFurniture() {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeCounterLogic);
    }

    public getCounterFurniture(team: RoomFreezeGameTeam) {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeCounterLogic && furniture.logic.team === team);
    }

    public getTeamAvatarEffect(player: RoomFreezeGamePlayer) {
        if(player.shield) {
            switch(player.team) {
                case "red":
                    return "AvatarEffect.49";
                    
                case "green":
                    return "AvatarEffect.50";
                    
                case "blue":
                    return "AvatarEffect.51";
                    
                case "yellow":
                    return "AvatarEffect.52";
            }
        }

        switch(player.team) {
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

    private getTeamWithMostScore() {
        let leadingTeam: RoomFreezeGameTeam | null = null;

        for(const team of Object.keys(this.teams)) {
            if(this.teams[team as RoomFreezeGameTeam].score === 0) {
                continue;
            }
            
            if(leadingTeam === null) {
                if(this.players.getTeamPlayers(team as RoomFreezeGameTeam).length > 0) {
                    leadingTeam = team as RoomFreezeGameTeam;
                }

                continue;
            }

            if(this.teams[team as RoomFreezeGameTeam].score === this.teams[leadingTeam].score) {
                if(this.players.getTeamPlayers(team as RoomFreezeGameTeam).length > this.players.getTeamPlayers(leadingTeam).length) {
                    leadingTeam = team as RoomFreezeGameTeam;
                }
            }

            if(this.teams[team as RoomFreezeGameTeam].score > this.teams[leadingTeam].score) {
                leadingTeam = team as RoomFreezeGameTeam;
            }
        }

        return leadingTeam;
    }
}
