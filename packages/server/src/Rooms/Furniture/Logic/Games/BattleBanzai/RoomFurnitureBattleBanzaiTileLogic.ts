import { RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import { RoomBattleBanzaiGameTeam } from "../../../../Games/BattleBanzai/Interfaces/RoomBattleBanzaiGameTeam";
import RoomUser from "../../../../Users/RoomUser";
import RoomFurniture from "../../../RoomFurniture";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic";
import RoomBattleBanzaiGame from "../../../../Games/BattleBanzai/RoomBattleBanzaiGame";

export default class RoomFurnitureBattleBanzaiTileLogic implements RoomFurnitureLogic {
    public locked = false;
    public lockedTeam: RoomBattleBanzaiGameTeam | null = null;

    constructor(private readonly roomFurniture: RoomFurniture) {
    }

    async handleActionsInterval(): Promise<void> {
        
    }

    async handleBeforeUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        if (!this.roomFurniture.room.games.isGamePlaying(RoomBattleBanzaiGame)) {
            return;
        }

        const game = this.roomFurniture.room.games.getGame(RoomBattleBanzaiGame);

        if(!game) {
            return;
        }

        const player = game.players.getPlayer(roomUser);

        if (!player) {
            return;
        }

        if (this.locked) {
            return;
        }

        const teamAnimationId = ["red", "green", "blue", "yellow"].indexOf(player.team);

        const teamStartAnimationId = 3 + (teamAnimationId * 3);
        const teamFinishAnimationId = teamStartAnimationId + 2;

        if (this.roomFurniture.model.animation >= teamStartAnimationId && this.roomFurniture.model.animation < teamFinishAnimationId) {
            await this.roomFurniture.setAnimation(this.roomFurniture.model.animation + 1);

            if (this.roomFurniture.model.animation === teamFinishAnimationId) {
                game.teams.addTeamScore(player.team, 1);

                this.locked = true;
                this.lockedTeam = player.team;

                const autoFillAreas = this.getAutoFillArea(teamFinishAnimationId);

                if (autoFillAreas.length) {
                    const autoFillFurnitureAnimations = autoFillAreas.flatMap((autoFillArea) => {
                        const autoFilledTiles = this.getTilesInsideConvex(autoFillArea);

                        return autoFilledTiles.map((furniture) => {
                            (furniture.logic as RoomFurnitureBattleBanzaiTileLogic).locked = true;
                            (furniture.logic as RoomFurnitureBattleBanzaiTileLogic).lockedTeam = player.team;

                            return {
                                furniture,
                                animation: teamFinishAnimationId
                            };
                        });
                    });

                    await this.roomFurniture.room.setBulkFurnitureAnimations(autoFillFurnitureAnimations);

                    game.teams.addTeamScore(player.team, autoFillFurnitureAnimations.length);

                    roomUser.user.achievements.addAchievementScore("LordOfTheTiles", autoFillAreas.length + 1).catch(console.error);
                }
                else {
                    roomUser.user.achievements.addAchievementScore("LordOfTheTiles", 1).catch(console.error);
                }
            }

            return;
        }

        await this.roomFurniture.setAnimation(teamStartAnimationId);
    }

    private getAutoFillArea(filledTileAnimation: number) {
        const tileMap = this.buildTileMap(filledTileAnimation);

        console.debug("Home is " + JSON.stringify(this.roomFurniture.model.position));

        const results: RoomPositionData[][] = [];

        for (let direction = 0; direction < 8; direction++) {
            const firstDirectionMaxOffset = this.getFurthestAutoFillTile(this.roomFurniture, direction, tileMap);

            console.debug("Checking direction " + direction + " for first row (max " + firstDirectionMaxOffset + ")");

            for (let firstOffset = firstDirectionMaxOffset; firstOffset > 0; firstOffset--) {
                const first = this.getTileFromMap(this.roomFurniture.getOffsetPosition(firstOffset, direction), tileMap);

                if(!first) {
                    continue;
                }

                console.debug("\tChecking left and right");

                for (const directionAddition of [2, -2]) {
                    const secondDirection = this.getNormalizedDirection(direction + directionAddition);
                    const secondDirectionMaxOffset = this.getFurthestAutoFillTile(first, secondDirection, tileMap);

                    console.debug("\t\tChecking second row with direction " + secondDirection + " (max " + secondDirectionMaxOffset + ")");

                    for (let secondOffset = secondDirectionMaxOffset; secondOffset > 0; secondOffset--) {
                        const second = this.getTileFromMap(first.getOffsetPosition(secondOffset, secondDirection), tileMap);

                        if(!second) {
                            continue;
                        }

                        const thirdDirection = this.getNormalizedDirection(secondDirection + directionAddition);
                        const thirdDirectionMaxOffset = this.getFurthestAutoFillTile(second, thirdDirection, tileMap);

                        console.debug("\t\t\tChecking third row with direction " + thirdDirection + " (max " + thirdDirectionMaxOffset + ")");

                        for (let thirdOffset = thirdDirectionMaxOffset; thirdOffset > 0; thirdOffset--) {
                            const third = this.getTileFromMap(second.getOffsetPosition(thirdOffset, thirdDirection), tileMap);

                            if(!third) {
                                continue;
                            }

                            const fourthDirection = this.getNormalizedDirection(thirdDirection + directionAddition);
                            const fourthDirectionMaxOffset = this.getFurthestAutoFillTile(third, fourthDirection, tileMap);

                            console.debug("\t\t\t\tChecking fourth row with direction " + fourthDirection + " (max " + fourthDirectionMaxOffset + ")");

                            for (let fourthOffset = fourthDirectionMaxOffset; fourthOffset > 0; fourthOffset--) {
                                const fourth = this.getTileFromMap(third.getOffsetPosition(fourthOffset, fourthDirection), tileMap);

                                if(!fourth) {
                                    continue;
                                }

                                console.debug("\t\t\t\t\tChecking if home is " + JSON.stringify(fourth.model.position));

                                if (fourth.model.position.row === this.roomFurniture.model.position.row && fourth.model.position.column === this.roomFurniture.model.position.column) {
                                    results.push([
                                        first.model.position,
                                        second.model.position,
                                        third.model.position,
                                        fourth.model.position
                                    ]);
                                }

                                const returningDirection = this.getNormalizedDirection(fourthDirection + directionAddition);
                                const returningDirectionMaxOffset = this.getFurthestAutoFillTile(fourth, returningDirection, tileMap);

                                console.debug("\t\t\t\t\t\tChecking retuning row with direction " + returningDirection + " (max " + returningDirectionMaxOffset + ")");

                                for (let returningOffset = returningDirectionMaxOffset; returningOffset > 0; returningOffset--) {
                                    const returning = this.getTileFromMap(fourth.getOffsetPosition(returningOffset, returningDirection), tileMap);

                                    if(!returning) {
                                        continue;
                                    }

                                    console.debug("\t\t\t\t\t\t\tChecking if home is " + JSON.stringify(returning.model.position));

                                    if (returning.model.position.row === this.roomFurniture.model.position.row && returning.model.position.column === this.roomFurniture.model.position.column) {
                                        results.push([
                                            first.model.position,
                                            second.model.position,
                                            third.model.position,
                                            returning.model.position
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return results;
    }

    private getNormalizedDirection(direction: number) {
        while(direction < 0) {
            direction += 8;
        }

        return direction % 8;
    }

    private getFurthestAutoFillTile(furniture: RoomFurniture, direction: number, tileMap: Map<string, RoomFurniture>) {
        let furthestOffset: number = 0;
        let nextFilledTile: RoomFurniture | undefined = this.getTileFromMap(furniture.getOffsetPosition(furthestOffset, direction), tileMap);
        
        while(nextFilledTile) {
            furthestOffset++;

            nextFilledTile = this.getTileFromMap(furniture.getOffsetPosition(furthestOffset, direction), tileMap);
        }

        return furthestOffset;
    }

    private getTileFromMap(position: RoomPositionOffsetData, tileMap: Map<string, RoomFurniture>) {
        return tileMap.get(`${position.row},${position.column}`);
    }

    private buildTileMap(filledTileAnimation: number): Map<string, RoomFurniture> {
        const map = new Map<string, RoomFurniture>();

        for (const furniture of this.roomFurniture.room.furnitures) {
            if(furniture.logic instanceof RoomFurnitureBattleBanzaiTileLogic && furniture.model.animation === filledTileAnimation) {
                map.set(`${furniture.model.position.row},${furniture.model.position.column}`, furniture);
            }
        }

        return map;
    }

    private getPositionCross(a: RoomPositionData, b: RoomPositionData, position: RoomPositionData): number {
        return (b.row - a.row) * (position.column - a.column) - (b.column - a.column) * (position.row - a.row);
    }

    private isPositionInsideConvex(position: RoomPositionData, polygon: RoomPositionData[]): boolean {
        let sign = 0;

        for (let index = 0; index < polygon.length; index++) {
            const corner = polygon[index];
            const oppositCorner = polygon[(index + 1) % polygon.length];

            if (!corner || !oppositCorner) {
                continue;
            }

            const cross = this.getPositionCross(corner, oppositCorner, position);

            if (cross !== 0) {
                if (sign === 0) {
                    sign = Math.sign(cross);
                }
                else if (Math.sign(cross) !== sign) {
                    return false;
                }
            }
        }

        return true;
    }

    private getTilesInsideConvex(corners: RoomPositionData[]): RoomFurniture[] {
        return this.roomFurniture.room.furnitures.filter((furniture) => {
            if (!(furniture.logic instanceof RoomFurnitureBattleBanzaiTileLogic)) {
                return false;
            }

            if (furniture.logic.locked) {
                return false;
            }

            return this.isPositionInsideConvex(furniture.model.position, corners);
        });
    }
}
