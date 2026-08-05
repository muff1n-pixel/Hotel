import { RoomGamePlayer, RoomGamePlayers } from "../RoomGame";
import RoomBattleBanzaiGame from "./RoomBattleBanzaiGame";
import { RoomBattleBanzaiGamePlayer } from "./Interfaces/RoomBattleBanzaiGamePlayer";
import { RoomBattleBanzaiGameTeam, RoomBattleBanzaiGameTeamData } from "./Interfaces/RoomBattleBanzaiGameTeam";
import RoomUser from "../../Users/RoomUser";
import RoomFurnitureBattleBanzaiCounterLogic from "../../Furniture/Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiCounterLogic";

export default class RoomBattleBanzaiGameTeams {
    private teams: RoomBattleBanzaiGameTeamData[] = [];

    constructor(private readonly game: RoomBattleBanzaiGame) {

    }

    public addTeamScore(team: RoomBattleBanzaiGameTeam, score: number) {
        const teamData = this.getTeam(team);

        if(!teamData) {
            return;
        }

        teamData.score += score;

        for(const furniture of this.getTeamCounterFurniture(team)) {
            (furniture.logic as RoomFurnitureBattleBanzaiCounterLogic).updateAnimationTags(teamData.score).catch(console.error);
        }
        
        this.game.room.handleGameScore(team, teamData.score).catch(console.error);
    }

    public removeTeamScore(team: RoomBattleBanzaiGameTeam, score: number) {
        const teamData = this.getTeam(team);

        if(!teamData) {
            return;
        }

        teamData.score -= score;
        teamData.score = Math.max(0, teamData.score);

        for(const furniture of this.getTeamCounterFurniture(team)) {
            (furniture.logic as RoomFurnitureBattleBanzaiCounterLogic).updateAnimationTags(teamData.score).catch(console.error);
        }
        
        this.game.room.handleGameScore(team, teamData.score).catch(console.error);
    }

    public getTeam(team: RoomBattleBanzaiGameTeam) {
        return this.teams.find((_team) => _team.team === team);
    }

    public getAllTeams() {
        return this.teams;
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
        
    public getTeamCounterFurniture(team: RoomBattleBanzaiGameTeam) {
        return this.game.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBattleBanzaiCounterLogic && furniture.logic.team === team);
    }
}
