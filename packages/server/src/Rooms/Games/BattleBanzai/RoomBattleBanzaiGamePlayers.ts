import { RoomGamePlayer, RoomGamePlayers } from "../RoomGame";
import RoomBattleBanzaiGame from "./RoomBattleBanzaiGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam } from "./Interfaces/RoomBattleBanzaiGameTeam";
import RoomUser from "../../Users/RoomUser";

export default class RoomBattleBanzaiGamePlayers implements RoomGamePlayers<RoomBattleBanzaiGameTeam> {
    private players: RoomBattleBanzaiGamePlayer[] = [];

    constructor(private readonly game: RoomBattleBanzaiGame) {

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

        roomUser.addAction(this.game.getTeamAvatarEffect(player));

        for(const furniture of this.game.getGateFurniture(team)) {
            furniture.setAnimation(this.getTeamPlayers(team).length).catch(console.error);
        }
    }

    public hasPlayer(roomUser: RoomUser): boolean {
        return this.players.some((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public getPlayer(roomUser: RoomUser) {
        return this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);
    }

    public removePlayer(roomUser: RoomUser): void {
        const player = this.players.find((player) => player.roomUser.user.model.id === roomUser.user.model.id);

        if(!player) {
            return;
        }

        this.players.splice(this.players.indexOf(player), 1);

        roomUser.removeAction("AvatarEffect");

        for(const furniture of this.game.getGateFurniture(player.team)) {
            furniture.setAnimation(this.getTeamPlayers(player.team).length).catch(console.error);
        }
    }
}
