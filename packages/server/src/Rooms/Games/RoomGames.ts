import Room from "../Room";
import RoomGame, { RoomGameConstructor } from "./RoomGame";

export default class RoomGames {
    private games: RoomGame[] = [];

    constructor(private readonly room: Room) {

    }

    public getOrAddGame<T extends RoomGame>(constructor: RoomGameConstructor<T>) {
        const existingGame = this.getGame(constructor);

        if(existingGame) {
            return existingGame;
        }

        const game = new constructor(this.room);

        this.games.push(game);

        return game;
    }

    public getGame<T extends RoomGame>(constructor: RoomGameConstructor<T>): T | undefined {
        return this.games.find((game) => game instanceof constructor) as T | undefined;
    }

    public getAllGames() {
        return this.games;
    }

    public hasGame(constructor: RoomGameConstructor) {
        return this.games.some((game) => game instanceof constructor);
    }

    public isGamePlaying(constructor: RoomGameConstructor) {
        const game = this.getGame(constructor);

        if(!game) {
            return false;
        }

        if(!game.started) {
            return false;
        }

        if(game.paused) {
            return false;
        }

        return true;
    }

    public async startGame(constructor: RoomGameConstructor, seconds: number) {
        const game = this.getOrAddGame(constructor);

        await game.startGame(seconds);

        return game;
    }

    public async endGame(constructor: RoomGameConstructor, reason: "eliminations" | "counter") {
        const game = this.getGame(constructor);

        if(!game) {
            return;
        }

        await game.endGame(reason);

        return game;
    }
}
