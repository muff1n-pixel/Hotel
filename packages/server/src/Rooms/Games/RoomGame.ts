import Room from "../Room";
import RoomUser from "../Users/RoomUser";

export interface RoomGamePlayer<T> {
    team: T;

    roomUser: RoomUser;
}

export type RoomGameConstructor<T extends RoomGame = RoomGame> = new (room: Room) => T;

export default interface RoomGame<T = unknown> {
    started: boolean;
    paused: boolean;

    seconds: number;

    handleActionsInterval?(): Promise<void>;

    startGame(seconds: number): Promise<void>;
    endGame(reason: "eliminations" | "counter"): Promise<void>;

    resumeGame(): Promise<void>;
    pauseGame(): Promise<void>;

    players: RoomGamePlayers<T>;
}

export interface RoomGamePlayers<T = unknown> {
    getTeamPlayers(team: T): RoomGamePlayer<T>[];

    hasPlayer(roomUser: RoomUser): boolean;
    addPlayer(roomUser: RoomUser, team: T): void;
    removePlayer(roomUser: RoomUser): void;

    givePlayerScore(roomUser: RoomUser, score: number): void;
    removePlayerScore(roomUser: RoomUser, score: number): void;
}
