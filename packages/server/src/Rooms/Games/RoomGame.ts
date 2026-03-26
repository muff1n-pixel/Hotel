import RoomUser from "../Users/RoomUser";

export interface RoomGamePlayer<T> {
    team: T;

    roomUser: RoomUser;
}

export default interface RoomGame<T = unknown> {
    started: boolean;
    paused: boolean;

    seconds: number;

    startGame(seconds: number): Promise<void>;
    endGame(reason: "eliminations" | "counter"): Promise<void>;

    resumeGame(): Promise<void>;
    pauseGame(): Promise<void>;
    
    getTeamPlayers(team: T): RoomGamePlayer<T>[];

    hasPlayer(roomUser: RoomUser): boolean;
    addPlayer(roomUser: RoomUser, team: T): void;
    removePlayer(roomUser: RoomUser): void;
}
