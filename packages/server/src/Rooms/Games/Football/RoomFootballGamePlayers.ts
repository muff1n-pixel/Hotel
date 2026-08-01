import { RoomGamePlayer, RoomGamePlayers } from "../RoomGame";
import RoomUser from "../../Users/RoomUser";
import { RoomFootballGamePlayer } from "./Interfaces/RoomFootballGamePlayer";
import RoomFootballGame from "./RoomFootballGame";
import { RoomFootballGameTeam } from "./Interfaces/RoomFootballGameTeam";
import { WidgetNotificationData } from "@pixel63/events";
import FootballGameNotifications from "../../../Users/Notifications/Games/FootballGameNotifications";

export default class RoomFootballGamePlayers implements RoomGamePlayers {
    private players: RoomFootballGamePlayer[] = [];

    constructor(private readonly game: RoomFootballGame) {

    }

    public getTeamPlayers(team: RoomFootballGameTeam): RoomGamePlayer<RoomFootballGameTeam>[] {
        return [];
    }

    public addPlayer(roomUser: RoomUser): void {
        this.removePlayer(roomUser);
        
        const player: RoomFootballGamePlayer = {
            roomUser,
            score: 0
        };

        this.players.push(player);

        for(const player of this.getAllPlayers()) {
            player.roomUser.user.sendProtobuff(WidgetNotificationData, FootballGameNotifications.buildPlayerJoinedGame(player));
        }
    }

    public hasPlayer(roomUser: RoomUser): boolean {
        return this.players.some((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public getPlayer(roomUser: RoomUser) {
        return this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public getAllPlayers() {
        return this.players;
    }

    public resetPlayerScores() {
        for(const player of this.players) {
            player.score = 0;
        }
    }

    public removePlayer(roomUser: RoomUser): void {
        const player = this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);

        if(!player) {
            return;
        }

        this.players.splice(this.players.indexOf(player), 1);

        roomUser.resetTemporaryFigureConfiguration();
    }

    public givePlayerScore(roomUser: RoomUser, score: number): void {
        const player = this.getPlayer(roomUser);

        if(!player) {
            return;
        }

        player.score += score;
    }

    public removePlayerScore(roomUser: RoomUser, score: number): void {
        const player = this.getPlayer(roomUser);

        if(!player) {
            return;
        }

        player.score -= score;
    }
}
