import RoomFootballGame from "./RoomFootballGame";
import { RoomFootballGameTeam, RoomFootballGameTeamData } from "./Interfaces/RoomFootballGameTeam";
import RoomFurnitureFootballCounterLogic from "../../Furniture/Logic/Games/Football/RoomFurnitureFootballCounterLogic";

export default class RoomFootballGameTeams {
    private teams: RoomFootballGameTeamData[] = [];

    constructor(private readonly game: RoomFootballGame) {

    }

    public addTeamScore(team: RoomFootballGameTeam, score: number) {
        const teamData = this.getTeam(team);

        if(!teamData) {
            return;
        }

        teamData.score += score;

        console.log("Add score to " + score + " " + team);

        for(const furniture of this.getTeamCounterFurniture(team)) {
            console.log("Furniture");
            (furniture.logic as RoomFurnitureFootballCounterLogic).updateAnimationTags(teamData.score).catch(console.error);
        }
        
        this.game.room.handleGameScore(team, teamData.score).catch(console.error);
    }

    public removeTeamScore(team: RoomFootballGameTeam, score: number) {
        const teamData = this.getTeam(team);

        if(!teamData) {
            return;
        }

        teamData.score -= score;
        teamData.score = Math.max(0, teamData.score);

        for(const furniture of this.getTeamCounterFurniture(team)) {
            (furniture.logic as RoomFurnitureFootballCounterLogic).updateAnimationTags(teamData.score).catch(console.error);
        }
        
        this.game.room.handleGameScore(team, teamData.score).catch(console.error);
    }

    public getTeam(team: RoomFootballGameTeam) {
        return this.teams.find((_team) => _team.team === team);
    }

    public getAllTeams() {
        return this.teams;
    }

    public resetTeams() {
        this.teams = [];

        for(const team of (["red", "green", "blue", "yellow"] satisfies RoomFootballGameTeam[])) {
            this.teams.push({
                team,
                score: 0
            });
        }
    }
    
    public getTeamWithMostScore() {
        let leadingTeam: RoomFootballGameTeamData | null = null;

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
                leadingTeam = null;
            }
            else if(team.score > leadingTeam.score) {
                leadingTeam = team;
            }
        }

        return leadingTeam;
    }
        
    public getTeamCounterFurniture(team: RoomFootballGameTeam) {
        return this.game.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureFootballCounterLogic && furniture.logic.team === team);
    }
}
