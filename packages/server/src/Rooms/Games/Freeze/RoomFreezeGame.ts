import { RoomPositionData, RoomPositionOffsetData, RoomUserData, WidgetNotificationData } from "@pixel63/events";
import RoomFurnitureFreezeGateLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeGateLogic";
import RoomFurnitureFreezeTileLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeTileLogic";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomFurnitureFreezeBlockLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeBlockLogic";
import RoomFurnitureFreezeExitLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeExitLogic";
import RoomFurnitureFreezeCounterLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeCounterLogic";
import { randomUUID } from "crypto";

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

export default class RoomFreezeGame {
    public started: boolean = false;
    public paused: boolean = false;

    public players: RoomFreezeGamePlayer[] = [];

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
   
    constructor(private readonly room: Room) {

    }

    public async startGame() {
        if(this.started) {
            return;
        } 

        this.started = true;
        this.paused = false;

        this.teams.red.score = 0;
        this.teams.green.score = 0;
        this.teams.blue.score = 0;
        this.teams.yellow.score = 0;

        for(const player of this.players) {
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

        for(const furniture of this.getTileFurniture()) {
            await furniture.setAnimation(0);

            if(exitFurniture) {
                const actors = this.room.getActorsAtPosition(RoomPositionOffsetData.fromJSON(furniture.model.position));

                for(const actor of actors) {
                    if(actor instanceof RoomUser && !this.getPlayer(actor)) {
                        actor.removeAction("AvatarEffect");
                        actor.addAction("AvatarEffect.4", 1000);

                        actor.path.teleportTo(RoomPositionOffsetData.fromJSON(exitFurniture.model.position));
                    }
                }
            }
        }

        for(const furniture of this.getBoxFurniture()) {
            if(this.room.getActorsAtPosition(RoomPositionOffsetData.fromJSON(furniture.model.position)).length > 0) {
                await (furniture.logic as RoomFurnitureFreezeBlockLogic).handleSnowball(true);
            }
            else {
                await furniture.setAnimation(0);
            }
        }

        for(const furniture of this.getAllExitFurniture()) {
            await furniture.setAnimation(1);
        }

        for(const furniture of this.getAllCounterFurniture()) {
            await (furniture.logic as RoomFurnitureFreezeCounterLogic).updateAnimationTags(0);
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

    public async endGame(reason: "counter" | "eliminations") {
        if(!this.started) {
            return;
        }
        
        this.started = false;
        this.paused = false;

        const winnerTeam = this.getTeamWithMostScore();

        for(const player of this.players) {
            this.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                id: player.roomUser.user.model.id,

                updateHealth: true,
                health: null
            }));

            if(reason === "counter") {
                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `The game of Freeze has ran out of time, ${(winnerTeam)?(`the ${winnerTeam} team won the game with ${this.teams[winnerTeam].score} score`):("no team managed to snatch the victory")}!`,
                    imageUrl: `/assets/widgets/freeze/team_${(winnerTeam)?(winnerTeam):("red")}.png`
                }));
            }
            else if(reason === "eliminations") {
                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `${(winnerTeam)?(`The ${winnerTeam} team won the game of Freeze with ${this.teams[winnerTeam].score} score`):("No team managed to snatch the victory")}!`,
                    imageUrl: `/assets/widgets/freeze/team_${(winnerTeam)?(winnerTeam):("red")}.png`
                }));
            }
        }

        for(const player of this.getFrozenPlayers()) {
            this.unfreezePlayer(player);
        }

        for(const furniture of this.getAllExitFurniture()) {
            await furniture.setAnimation(0);
        }
    }

    public async handleActionsInterval() {
        for(const player of this.players) {
            if(player.shield && performance.now() - player.shieldAt >= 5000) {
                player.shield = false;
                
                player.roomUser.removeAction("AvatarEffect");
                player.roomUser.addAction(this.getTeamAvatarEffect(player));
            }

            if(player.roomUser.path.frozen) {
                if(performance.now() - player.roomUser.path.frozenAt >= 5000) {
                    this.unfreezePlayer(player);

                    if(player.health === 0) {
                        const exitFurniture = this.getExitFurniture();

                        if(exitFurniture) {
                            this.removePlayer(player.roomUser);

                            player.roomUser.removeAction("AvatarEffect");
                            player.roomUser.addAction("AvatarEffect.4", 1000);

                            player.roomUser.path.teleportTo(RoomPositionOffsetData.fromJSON(exitFurniture.model.position));
                            
                            player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                                id: randomUUID(),
                                text: `You lost all your lives and were eliminated from the round!`,
                                imageUrl: "/assets/widgets/freeze/exit.png"
                            }));
                        }
                    }
                }
            }
        }
    }

    public addPlayer(roomUser: RoomUser, team: RoomFreezeGameTeam) {
        const player: RoomFreezeGamePlayer = {
            roomUser,
            team,
            health: 3,
            
            radius: 3,
            
            shield: false,
            shieldAt: 0,

            crossBlast: false,

            maxSnowballs: 1,
            currentSnowballs: 0,

            megaSnowball: false
        };

        this.players.push(player);

        this.updateGateFurniture(team);

        roomUser.addAction(this.getTeamAvatarEffect(player));

        roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
            id: randomUUID(),
            text: `You have joined the ${team} team!`,
            imageUrl: `/assets/widgets/freeze/team_${team}.png`
        }));
    }

    public givePlayerPowerup(player: RoomFreezeGamePlayer, powerup: RoomFreezeGamePowerups) {
        switch(powerup) {
            case RoomFreezeGamePowerups.ExtraLife: {
                if(player.health < 5) {
                    player.health++;

                    this.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                        id: player.roomUser.user.model.id,

                        updateHealth: true,
                        health: player.health
                    }));

                    player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                        id: randomUUID(),
                        text: `You picked up an Extra Life power-up!`,
                        imageUrl: `/assets/widgets/freeze/extra_life.png`
                    }));
                }

                break;
            }

            case RoomFreezeGamePowerups.BiggerBomb: {
                player.radius++;

                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a Bigger Bomb power-up! Your snowballs now reach 1 tile further!`,
                    imageUrl: `/assets/widgets/freeze/bigger_bomb.png`
                }));

                break;
            }

            case RoomFreezeGamePowerups.Shield: {
                player.shield = true;
                player.shieldAt = performance.now();
                
                player.roomUser.removeAction("AvatarEffect");
                player.roomUser.addAction(this.getTeamAvatarEffect(player));

                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a Shield power-up! You are invincible for 5 seconds!`,
                    imageUrl: `/assets/widgets/freeze/shield.png`
                }));

                break;
            }

            case RoomFreezeGamePowerups.CrossBlast: {
                player.crossBlast = true;

                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a X-Blast power-up! Your next snowball will cross diagonally!`,
                    imageUrl: `/assets/widgets/freeze/crossblast.png`
                }));

                break;
            }

            case RoomFreezeGamePowerups.MorePower: {
                player.maxSnowballs++;

                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a More Power power-up! You can now throw more snowballs simultaneously!`,
                    imageUrl: `/assets/widgets/freeze/more_bombs.png`
                }));

                break;
            }

            case RoomFreezeGamePowerups.MegaSnowball: {
                player.megaSnowball = true;

                player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a Mega Snowball power-up! Your next snowball will affect a larger area of tiles!`,
                    imageUrl: `/assets/widgets/freeze/mega_bomb.png`
                }));

                break;
            }
        }
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
            
            roomUser.removeAction("AvatarEffect");

            const uniqueTeamsLeft = [...new Set(this.players.map((player) => player.team))];

            if(uniqueTeamsLeft.length <= 1) {
                this.endGame("eliminations");
            }
        }
    }

    public getTeamPlayers(team: RoomFreezeGameTeam) {
        return this.players.filter((player) => player.team === team);
    }

    public getFrozenPlayers() {
        return this.players.filter((player) => player.roomUser.path.frozen);
    }

    public freezePlayer(player: RoomFreezeGamePlayer, triggerPlayer: RoomFreezeGamePlayer) {
        if(player.roomUser.path.frozen) {
            return;
        }

        if(player.shield) {
            return;
        }

        player.roomUser.removeAction("AvatarEffect");
        player.roomUser.addAction("AvatarEffect.12");
        
        player.roomUser.path.setFrozen(true);

        if(player.health > 0) {
            player.health--;

            this.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                id: player.roomUser.user.model.id,

                updateHealth: true,
                health: (player.health > 0)?(player.health):(undefined)
            }));
        }

        player.roomUser.user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
            id: randomUUID(),
            text: `You got hit by ${(player.roomUser.user.model.id === triggerPlayer.roomUser.user.model.id)?("your own"):(triggerPlayer.roomUser.user.model.name + "'s")} snowball!`,
            imageUrl: `/assets/widgets/freeze/team_${triggerPlayer.team}_frozen.png`
        }));

        if(player.team !== triggerPlayer.team) {
            this.teams[triggerPlayer.team].score++;
        }
        else {
            this.teams[triggerPlayer.team].score--;
        }

        for(const furniture of this.getCounterFurniture(triggerPlayer.team)) {
            (furniture.logic as RoomFurnitureFreezeCounterLogic).updateAnimationTags(this.teams[triggerPlayer.team].score);
        }
    }

    public unfreezePlayer(player: RoomFreezeGamePlayer) {
        player.roomUser.removeAction("AvatarEffect");
        player.roomUser.addAction(this.getTeamAvatarEffect(player));

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

    private getCounterFurniture(team: RoomFreezeGameTeam) {
        return this.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFreezeCounterLogic && furniture.logic.team === team);
    }

    private getTeamAvatarEffect(player: RoomFreezeGamePlayer) {
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
            if(leadingTeam === null) {
                if(this.getTeamPlayers(team as RoomFreezeGameTeam).length > 0) {
                    leadingTeam = team as RoomFreezeGameTeam;
                }

                continue;
            }

            if(this.teams[team as RoomFreezeGameTeam].score === this.teams[leadingTeam].score) {
                if(this.getTeamPlayers(team as RoomFreezeGameTeam).length > this.getTeamPlayers(leadingTeam).length) {
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
