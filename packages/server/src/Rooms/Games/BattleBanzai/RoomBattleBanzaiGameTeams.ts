import { RoomGamePlayer, RoomGamePlayers } from "../RoomGame";
import RoomBattleBanzaiGame from "./RoomBattleBanzaiGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam, RoomBattleBanzaiGameTeamData } from "./Interfaces/RoomBattleBanzaiGameTeam";
import RoomUser from "../../Users/RoomUser";

export default class RoomBattleBanzaiGameTeams {
    private teams: RoomBattleBanzaiGameTeamData[] = [];

    constructor(private readonly game: RoomBattleBanzaiGame) {

    }

    public resetTeams() {
        this.teams = [];

        for(const team of (["red", "green", "blue", "yellow"] satisfies RoomBattleBanzaiGameTeam[])) {
            this.teams.push({
                team,
                score: 0
            });
        }
    }
    
    public getTeamWithMostScore() {
        let leadingTeam: RoomBattleBanzaiGameTeamData | null = null;

        for(const team of this.teams) {
            if(team.score === 0) {
                continue;
            }
            
            if(leadingTeam === null) {
                if(this.game.players.getTeamPlayers(team.team).length > 0) {
                    leadingTeam = team;
                }

                continue;
            }

            if(team.score === leadingTeam.score) {
                if(this.game.players.getTeamPlayers(team.team).length > this.game.players.getTeamPlayers(leadingTeam.team).length) {
                    leadingTeam = team;
                }
            }

            if(team.score > leadingTeam.score) {
                leadingTeam = team;
            }
        }

        return leadingTeam;
    }
}
