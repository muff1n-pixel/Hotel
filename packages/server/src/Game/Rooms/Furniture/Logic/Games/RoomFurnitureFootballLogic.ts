import { RoomFurnitureMovedData, RoomPositionData, RoomPositionOffsetData, UseRoomFurnitureData, WidgetNotificationData } from "@pixel63/events";
import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";
import RoomFurnitureLogic from "./../Interfaces/RoomFurnitureLogic.js";
import RoomFootballGame from "../../../Games/Football/RoomFootballGame.js";
import RoomFurnitureFootballGoalLogic from "./Football/RoomFurnitureFootballGoalLogic.js";
import FootballGameNotifications from "../../../../Users/Notifications/Games/FootballGameNotifications.js";

export default class RoomFurnitureFootballLogic implements RoomFurnitureLogic {
    private travelingDirection: number | null = null;
    private travelingVelocity: number | null = null;
    private travelingPassing: boolean | null = null;
    private triggeringUser: RoomUser | null = null;

    private travelingInterval: NodeJS.Timeout | null = null;

    constructor(public readonly roomFurniture: RoomFurniture) {

    }

    async handleBeforeUserWalksOn(roomUser: RoomUser, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        this.travelingDirection = roomUser.direction;
        this.travelingPassing = Boolean(roomUser.path.path && roomUser.path.path.length > 0);
        this.travelingVelocity = (this.travelingPassing)?(2):(6);
        this.triggeringUser = roomUser;

        this.moveFurniture().catch(console.error);
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
    }

    async moveFurniture() {
        if(this.travelingInterval !== null) {
            clearTimeout(this.travelingInterval);
            
            this.travelingInterval = null;
        }

        if(this.travelingVelocity !== null && this.travelingDirection !== null) {
            this.travelingVelocity--;

            if(this.travelingVelocity === 0) {
                this.travelingVelocity = null;
                this.travelingDirection = null;
                
                this.roomFurniture.setAnimation(0);

                this.handleFootballStopped().catch(console.error);

                if(this.travelingInterval !== null) {
                    clearTimeout(this.travelingInterval);

                    this.travelingInterval = null;
                }

                return;
            }

            let nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);

            if(!this.isPositionValid(nextOffsetPosition)) {
                const originalTravelingDirection = this.travelingDirection;

                if((this.travelingDirection % 2) !== 0) {
                    this.travelingDirection += 2;
                    
                    this.travelingDirection %= 8;
            
                    nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);
                }
                
                if(!this.isPositionValid(nextOffsetPosition)) {
                    this.travelingDirection -= 4;
                    
                    this.travelingDirection %= 8;
                }
                
                if(!this.isPositionValid(nextOffsetPosition)) {
                    this.travelingDirection = originalTravelingDirection + 4;
                    this.travelingDirection %= 8;
                }
            
                nextOffsetPosition = this.roomFurniture.getOffsetPosition(1, this.travelingDirection);
                
                if(!this.isPositionValid(nextOffsetPosition)) {
                    this.travelingVelocity = 0;
                
                    this.roomFurniture.setAnimation(0);
                
                    this.handleFootballStopped().catch(console.error);

                    return;
                }
            }

            const nextFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(nextOffsetPosition);
            
            const depth = this.roomFurniture.room.getUpmostDepthAtPosition(nextOffsetPosition, nextFurniture);

            if(depth === null) {
                return;
            }
 
            const position = RoomPositionData.create({
                row: nextOffsetPosition.row,
                column: nextOffsetPosition.column,
                depth: depth + 0.0001
            });

            const duration = (this.travelingPassing)?(500):(1000 / this.travelingVelocity);

            await this.roomFurniture.movePosition(position, duration);

            if(this.travelingVelocity === 0) {
                this.travelingVelocity = null;
                this.travelingDirection = null;
                this.triggeringUser = null;
                
                this.roomFurniture.setAnimation(0);
                
                this.handleFootballStopped().catch(console.error);
            }
            else {
                this.travelingInterval = setTimeout(() => {
                    this.moveFurniture().catch(console.error);
                }, duration);
            }

            this.handleFootballMoved(this.triggeringUser, position).catch(console.error);

            if(this.roomFurniture.model.animation !== 1) {
                this.roomFurniture.setAnimation(1);
            }
        }
    }

    public async handleFootballMoved(user: RoomUser | null, position: RoomPositionData) {
        if(!this.roomFurniture.room.games.isGamePlaying(RoomFootballGame)) {
            return;
        }

        if(!user) {
            return;
        }

        const game = this.roomFurniture.room.games.getGame(RoomFootballGame);

        const player = game?.players.getPlayer(user);

        if(!player) {
            return;
        }

        const roomPositionOffset = RoomPositionOffsetData.fromJSON(position);

        const goalAtPosition = this.roomFurniture.room.furnitures.find((furniture) => furniture.logic instanceof RoomFurnitureFootballGoalLogic && furniture.isPositionInside(roomPositionOffset));

        if(game && goalAtPosition) {
            if(!(goalAtPosition.logic instanceof RoomFurnitureFootballGoalLogic)) {
                return;
            }

            player.roomUser.user.achievements.addAchievementScore("Player", 1).catch(console.error);
            player.roomUser.user.achievements.addAchievementScore("FootballGoalScorer", 1).catch(console.error);

            game?.giveTeamScore(goalAtPosition.logic.team, 1);

            player.roomUser.pose.wave();

            for(const player of game.players.getAllPlayers()) {
                player.roomUser.user.sendProtobuff(WidgetNotificationData, FootballGameNotifications.buildTeamScored(player, goalAtPosition.logic.team));
            }
        }
    }

    public async handleFootballStopped() {

    }

    private isPositionValid(position: RoomPositionOffsetData) {
        const floorplanDepth = this.roomFurniture.room.model.structure.grid[position.row]?.[position.column];

        if(!floorplanDepth || floorplanDepth === 'X') {
            return false;
        }

        const nextFurniture = this.roomFurniture.room.getUpmostFurnitureAtPosition(position);

        if(nextFurniture && (!nextFurniture.model.furniture.flags.walkable || (nextFurniture.logic?.isWalkable && !nextFurniture.logic.isWalkable()))) {
            return false;
        }

        return true;
    }
}
