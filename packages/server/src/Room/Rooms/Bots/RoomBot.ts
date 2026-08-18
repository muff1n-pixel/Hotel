import Room from "../Room.js";
import { UserBotModel } from "../../../Database/Models/Users/Bots/UserBotModel.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import { RoomActorActionData, RoomActorChatData, RoomActorIdentifierData, RoomActorPositionData, RoomActorWalkToData, RoomBotsData, RoomPositionData, RoomPositionOffsetData, ServerUserInventoryUpdatedData } from "@pixel63/events";
import RoomUser from "../Users/RoomUser.js";
import RoomActorPose from "../Actor/Poses/RoomActorPose.js";
import RoomFigurePose from "../Actor/Poses/RoomFigurePose.js";
import RoomServer from "../../RoomServer.js";
import Directions from "../../../Helpers/Directions.js";

export default class RoomBot implements RoomActor {
    public preoccupiedByActionHandler: boolean = false;

    public actions: string[] = [];
    public position: RoomPositionData;
    public direction: number;

    public path: RoomActorPath;

    public lastActivity: number = 0;

    public pose: RoomActorPose = new RoomFigurePose(this);

    constructor(public readonly room: Room, public readonly model: UserBotModel) {
        this.position = model.position;
        this.direction = model.direction;

        this.path = new RoomActorPath(this);
    }

    public static async place(room: Room, userBot: UserBotModel, position: RoomPositionData, direction: number) {
        await userBot.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomBot = new RoomBot(room, userBot);

        room.bots.push(roomBot);

        room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position));

        room.sendProtobuff(RoomBotsData, RoomBotsData.fromJSON({
            botsAdded: [
                roomBot.model
            ]
        }));

        return roomBot;
    }

    public sendWalkEvent(previousPosition: RoomPositionData): void {
        this.room.sendProtobuff(RoomActorWalkToData, RoomActorWalkToData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            from: previousPosition,
            to: this.position,
            direction: this.direction
        }));
    }
    
    public sendDirectionEvent(): void {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            
            direction: this.direction,
        }));
    }

    public sendPositionEvent(usePath: boolean, roomActorActionsData?: RoomActorActionData | null) {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            
            position: this.position,
            direction: this.direction,
            usePath,

            action: roomActorActionsData ?? undefined
        }));
    }

    public async pickup() {
        this.room.bots.splice(this.room.bots.indexOf(this), 1);

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.model.position));

        this.room.sendProtobuff(RoomBotsData, RoomBotsData.fromJSON({
            botsRemoved: [
                this.model
            ]
        }));

        await this.model.update({
            roomId: null
        });

        RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
            userId: this.model.user.id,
            botsAdded: [this.model.id]
        }));
    }

    public async setPosition(position: RoomPositionData, save: boolean = true) {
        const previousPosition = this.model.position;

        this.position = position;

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(previousPosition));
        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position));

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendProtobuff(RoomBotsData, RoomBotsData.fromJSON({
                botsUpdated: [
                    this.model
                ]
            }));
        }
    }

    private lastChatMessage: number = 0;
    private lastChatMessageIndex: number | null = null;

    public async handleActionsInterval() {
        if(this.model.speech.automaticChat) {
            await this.handleAutomaticChat();
        }

        if(this.followingUsers.length) {
            this.handleFollowingUsers();
        }
        else if(this.model.relaxed) {
            await this.handleRelaxed();
        }

        await this.path.handleActionsInterval();
    }

    public async handleAutomaticChat() {
        if(!this.model.speech.automaticChat) {
            return;
        }

        const elapsedSinceLastChatMessage = performance.now() - this.lastChatMessage;

        if(elapsedSinceLastChatMessage < this.model.speech.automaticChatDelay * 1000) {
            return;
        }

        let message: string | null = null;

        if(this.model.speech.randomizeMessages) {
            message = this.model.speech.messages[Math.floor(Math.random() * this.model.speech.messages.length)] ?? null;
        }
        else {
            let index: number;

            if(this.lastChatMessageIndex === null) {
                index = 0;
            }
            else {
                index = this.lastChatMessageIndex + 1;

                if(index >= this.model.speech.messages.length) {
                    index = 0;
                }
            }

            message = this.model.speech.messages[index] ?? null;

            this.lastChatMessageIndex = index;
        }

        this.lastChatMessage = performance.now();

        if(!message) {
            return;
        }

        this.room.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },

            message,
            roomChatStyleId: "bot_guide"
        }));
    }

    private lastMovement: number = 0;

    public async handleRelaxed() {
        const elapsedSinceLastMovement = performance.now() - this.lastMovement;

        if(elapsedSinceLastMovement < 5 * 1000) {
            return;
        }

        if(this.path.path) {
            return;
        }

        this.lastMovement = performance.now();

        const targetPosition = RoomPositionOffsetData.create({
            row: this.model.position.row + Math.floor(Math.random() * 7) - 3,
            column: this.model.position.column + Math.floor(Math.random() * 7) - 3,
        });

        if(this.room.model.structure.door?.row === targetPosition.row && this.room.model.structure.door?.column === targetPosition.column) {
            return;
        }

        this.path.walkTo(targetPosition);
    }

    private followingUsers: RoomUser[] = [];

    public setFollowingUser(roomUser: RoomUser) {
        if(this.followingUsers.includes(roomUser)) {
            return;
        }

        this.followingUsers.push(roomUser);
    }

    public stopFollowingUser(roomUser: RoomUser) {
        const index = this.followingUsers.indexOf(roomUser);

        if(index === -1) {
            return;
        }

        this.followingUsers.splice(index, 1);
    }

    private handleFollowingUsers() {
        const userToFollow = this.followingUsers[Math.floor(Math.random() * this.followingUsers.length)];

        if(!userToFollow) {
            return;
        }

        this.path.walkTo(RoomPositionOffsetData.fromJSON(userToFollow.position));
    }
    
    public getActorIdentifier(): RoomActorIdentifierData {
        return RoomActorIdentifierData.create({
            bot: {
                botId: this.model.id
            }
        })
    }
        
    public getOffsetPosition(offset: number, direction: number | null = this.model.direction): RoomPositionOffsetData {
        return Directions.getPositionFromOffset(offset, this.model.position, direction);
    }
}
