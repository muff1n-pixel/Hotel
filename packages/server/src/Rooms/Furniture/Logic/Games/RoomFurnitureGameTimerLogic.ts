import { UserFurnitureAnimationTag, UserFurnitureCustomData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";
import RoomFurnitureLogic from "../Interfaces/RoomFurnitureLogic.js";
import RoomGame from "../../../Games/RoomGame.js";

export default class RoomFurnitureGameTimerLogic implements RoomFurnitureLogic {
    private seconds: number;

    constructor(public readonly roomFurniture: RoomFurniture) {
        this.seconds = roomFurniture.model.data?.gameTimer?.seconds ?? 30;

        this.updateAnimationTags().catch(console.error);
    }
    
    public getGame(): RoomGame {
        throw new Error("Not implemented");
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {
        if(!roomUser.hasRights()) {
            return;
        }

        if(payload.tag === "reset") {
            if(this.getGame().started && !this.getGame().paused) {
                return;
            }

            await this.getGame().endGame("counter");

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

            await this.getGame().endGame("counter");

            return;
        }

        if(!this.getGame().started) {
            this.seconds = (this.roomFurniture.model.data?.gameTimer?.seconds ?? 30);

            await this.updateAnimationTags();

            await this.getGame().startGame(this.seconds);
        }
        else {
            if(this.getGame().paused) {
                await this.getGame().resumeGame();
            }
            else {
                await this.getGame().pauseGame();
            }
        }
    }

    async handleActionsInterval(): Promise<void> {
        if(!this.getGame().started) {
            if(this.seconds === 1) {
                this.seconds = 0;
                
                await this.roomFurniture.setAnimation(0);
            }

            return;
        }

        if(this.getGame().paused) {
            return;
        }
        
        if(this.getGame().seconds !== this.seconds) {
            this.seconds = this.getGame().seconds;

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
