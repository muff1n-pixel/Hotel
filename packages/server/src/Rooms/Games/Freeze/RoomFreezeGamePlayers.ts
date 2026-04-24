import { RoomPositionData, RoomUserData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser";
import { RoomGamePlayers } from "../RoomGame";
import RoomFreezeGame, { RoomFreezeGamePlayer, RoomFreezeGameTeam } from "./RoomFreezeGame";
import UserFreezeGameNotifications from "../../../Users/Notifications/Games/UserFreezeGameNotifications";
import RoomFurnitureFreezeCounterLogic from "../../Furniture/Logic/Games/Freeze/RoomFurnitureFreezeCounterLogic";

export default class RoomFreezeGamePlayers implements RoomGamePlayers<RoomFreezeGameTeam> {
    private players: RoomFreezeGamePlayer[] = [];

    constructor(private readonly game: RoomFreezeGame) {

    }

    public hasPlayer(roomUser: RoomUser): boolean {
        return this.players.some((player) => player.roomUser.user.model.id === roomUser.user.model.id);
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

        this.game.updateGateFurniture(team);

        roomUser.addAction(this.game.getTeamAvatarEffect(player));

        roomUser.user.sendWidgetNotification(UserFreezeGameNotifications.buildPlayerJoinedTeam(team));
    }
    
    public getPlayer(roomUser: RoomUser) {
        return this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public getAllPlayers() {
        return this.players;
    }

    public getPlayerAtPosition(position: RoomPositionData) {
        return this.players.find((player) => player.roomUser.position.row === position.row && player.roomUser.position.column === position.column);
    }

    public removePlayer(roomUser: RoomUser) {
        const player = this.getPlayer(roomUser);
        
        if(player) {
            this.players.splice(this.players.indexOf(player), 1);

            this.game.updateGateFurniture(player.team);
            
            roomUser.removeAction("AvatarEffect");

            player.roomUser.user.achievements.addAchievementScore("FreezePlayer", this.game.teams[player.team].score).catch(console.error);

            const uniqueTeamsLeft = [...new Set(this.players.map((player) => player.team))];

            if(uniqueTeamsLeft.length <= 1) {
                this.game.endGame("eliminations").catch(console.error);
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

            this.game.room.sendProtobuff(RoomUserData, RoomUserData.fromJSON({
                id: player.roomUser.user.model.id,

                updateHealth: true,
                health: (player.health > 0)?(player.health):(undefined)
            }));
        }

        player.roomUser.user.sendWidgetNotification(UserFreezeGameNotifications.buildPlayerHit(player, triggerPlayer));

        if(player.roomUser.user.model.id !== triggerPlayer.roomUser.user.model.id) {
            triggerPlayer.roomUser.user.sendWidgetNotification(UserFreezeGameNotifications.buildTriggerPlayerHit(player));

            triggerPlayer.roomUser.user.achievements.addAchievementScore("FreezeFighter", 1).catch(console.error);
        }

        if(player.team !== triggerPlayer.team) {
            if(player.health === 0) {
                this.game.teams[triggerPlayer.team].score += 10;
            }
            else {
                this.game.teams[triggerPlayer.team].score++;
            }
        }
        else {
            this.game.teams[triggerPlayer.team].score--;
        }

        for(const furniture of this.game.getCounterFurniture(triggerPlayer.team)) {
            (furniture.logic as RoomFurnitureFreezeCounterLogic).updateAnimationTags(this.game.teams[triggerPlayer.team].score).catch(console.error);
        }

        this.game.room.handleGameScore(triggerPlayer.team, this.game.teams[triggerPlayer.team].score).catch(console.error);
    }

    public unfreezePlayer(player: RoomFreezeGamePlayer) {
        player.roomUser.removeAction("AvatarEffect");
        player.roomUser.addAction(this.game.getTeamAvatarEffect(player));

        player.roomUser.path.setFrozen(false);
    }
}