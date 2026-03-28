import { UserFurnitureAnimationTag, UserFurnitureCustomData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";
import RoomFurnitureLogic from "../Interfaces/RoomFurnitureLogic.js";
import RoomGame, { RoomGameConstructor } from "../../../Games/RoomGame.js";
import Room from "../../../Room.js";

export default class RoomFurnitureGameTimerLogic implements RoomFurnitureLogic {
    private seconds: number;
    private room: Room;

    constructor(public readonly roomFurniture: RoomFurniture, public readonly game: RoomGameConstructor) {
        this.room = this.roomFurniture.room;
        this.seconds = roomFurniture.model.data?.gameTimer?.seconds ?? 30;

        this.updateAnimationTags().catch(console.error);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(!roomUser.hasRights()) {
            return;
        }

        const game = this.room.games.getGame(this.game);

        if(payload.tag === "reset") {
            if(this.room.games.isGamePlaying(this.game)) {
                return;
            }

            if(game) {
                await game.endGame("counter");
            }

            if(this.seconds !== (this.roomFurniture.model.data?.gameTimer?.seconds ?? 30)) {
                this.seconds = (this.roomFurniture.model.data?.gameTimer?.seconds ?? 30);

                await this.updateAnimationTags();
            }
            else {
                this.seconds = this.getNextSecondsInterval();

                await this.roomFurniture.model.update({
                    data: UserFurnitureCustomData.create({
                        gameTimer: {
                            seconds: this.seconds
                        }
                    })
                });

                await this.updateAnimationTags();
            }

            // TODO: was this a mistake?
            //await this.getGame().endGame("counter");

            return;
        }

        if(!game?.started) {
            this.seconds = (this.roomFurniture.model.data?.gameTimer?.seconds ?? 30);

            await this.updateAnimationTags();

            await this.room.games.startGame(this.game, this.seconds);
        }
        else {
            if(game.paused) {
                await game.resumeGame();
            }
            else {
                await game.pauseGame();
            }
        }
    }

    async handleActionsInterval(): Promise<void> {
        const game = this.room.games.getGame(this.game);

        if(!game?.started) {
            if(this.seconds === 1) {
                this.seconds = 0;
                
                await this.roomFurniture.setAnimation(0);
            }

            return;
        }

        if(game.paused) {
            return;
        }
        
        if(game.seconds !== this.seconds) {
            this.seconds = game.seconds;

            if(this.seconds === 0) {
                await this.roomFurniture.setAnimation(0);
            }
            else {
                await this.updateAnimationTags();
            }
        }
    }

    private getNextSecondsInterval() {
        if(this.seconds !== (this.roomFurniture.model.data?.gameTimer?.seconds ?? 30)) {
            return (this.roomFurniture.model.data?.gameTimer?.seconds ?? 30);
        }

        switch(this.seconds) {
            case 30: return 60;
            case 60: return 2 * 60;
            case 2 * 60: return 3 * 60;
            case 3 * 60: return 5 * 60;
            case 5 * 60: return 10 * 60;

            default: return 30;
        }
    }

    private async updateAnimationTags() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;

        const tenMinutes = Math.floor(minutes / 10);
        const minutesDigit = minutes % 10;

        const tenSeconds = Math.floor(seconds / 10);
        const secondsDigit = seconds % 10;

        await this.roomFurniture.setAnimationTags([
            UserFurnitureAnimationTag.create({
                tag: "ten_minutes_sprite",
                frame: tenMinutes
            }),
            UserFurnitureAnimationTag.create({
                tag: "minutes_sprite",
                frame: minutesDigit
            }),
            UserFurnitureAnimationTag.create({
                tag: "ten_seconds_sprite",
                frame: tenSeconds
            }),
            UserFurnitureAnimationTag.create({
                tag: "seconds_sprite",
                frame: secondsDigit
            })
        ]);
    }
}
