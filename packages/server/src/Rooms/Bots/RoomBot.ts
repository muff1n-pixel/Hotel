import Room from "../Room.js";
import { UserBotModel } from "../../Database/Models/Users/Bots/UserBotModel.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { game } from "../../index.js";
import { RoomBotEventData } from "@shared/Communications/Responses/Rooms/Bots/RoomBotEventData.js";
import { UserBotData } from "@shared/Interfaces/Room/RoomBotData.js";
import { RoomChatEventData } from "@shared/Communications/Responses/Rooms/Chat/RoomChatEventData.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import { RoomActorActionData, RoomActorPositionData, RoomActorWalkToData } from "@pixel63/events";

export default class RoomBot implements RoomActor {
    public preoccupiedByActionHandler: boolean = false;

    public actions: string[] = [];
    public position: RoomPosition;
    public direction: number;

    public path: RoomActorPath;

    public lastActivity: number = 0;

    constructor(public readonly room: Room, public readonly model: UserBotModel) {
        this.position = model.position;
        this.direction = model.direction;

        this.path = new RoomActorPath(this);
    }

    public static async place(room: Room, userBot: UserBotModel, position: RoomPosition, direction: number) {
        await userBot.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomBot = new RoomBot(room, userBot);

        room.bots.push(roomBot);

        room.floorplan.updatePosition(position);

        room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
            botAdded: [
                roomBot.getBotData()
            ]
        }));

        return roomBot;
    }

    public getBotData(): UserBotData {
        return {
            id: this.model.id,
            userId: this.model.user.id,
            
            position: this.position,
            direction: this.direction,

            type: this.model.type,

            name: this.model.name,
            motto: this.model.motto,

            figureConfiguration: this.model.figureConfiguration,

            relaxed: this.model.relaxed,
        };
    }

    public hasAction(actionId: string): boolean {
        return this.actions.includes(actionId);
    }

    public addAction(action: string) {
        if(this.actions.includes(action)) {
            return;
        }

        this.actions.push(action);

        this.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            
            actionsAdded: [action]
        }));
    }

    public removeAction(action: string) {
        const actionId = action.split('.')[0]!;

        const existingActionIndex = this.actions.findIndex((action) => action.split('.')[0] === actionId);

        if(existingActionIndex === -1) {
            return;
        }

        this.actions.splice(existingActionIndex, 1);

        this.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            
            actionsRemoved: [actionId]
        }));
    }
    
    public sendWalkEvent(previousPosition: RoomPosition): void {
        this.room.sendProtobuff(RoomActorWalkToData, RoomActorWalkToData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            from: previousPosition,
            to: this.position
        }));
    }

    public sendPositionEvent(usePath: boolean) {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                bot: {
                    botId: this.model.id
                }
            },
            
            position: this.position,
            direction: this.direction,
            usePath
        }));
    }

    public async pickup() {
        this.room.bots.splice(this.room.bots.indexOf(this), 1);

        this.room.floorplan.updatePosition(this.model.position);

        this.room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
            botRemoved: [
                {
                    id: this.model.id
                }
            ]
        }));

        await this.model.update({
            roomId: null
        });

        const user = game.getUserById(this.model.user.id);

        if(user) {
            user.getInventory().addBot(this.model);
        }
    }

    public async setPosition(position: RoomPosition, save: boolean = true) {
        const previousPosition = this.model.position;

        this.position = position;

        this.room.floorplan.updatePosition(previousPosition);
        this.room.floorplan.updatePosition(position);

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendRoomEvent(new OutgoingEvent<RoomBotEventData>("RoomBotEvent", {
                botUpdated: [
                    this.getBotData()
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

        if(this.model.relaxed) {
            await this.handleRelaxed();
        }

        this.path.handleActionsInterval();
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

        this.room.sendRoomEvent(new OutgoingEvent<RoomChatEventData>("RoomChatEvent", {
            type: "bot",
            botId: this.model.id,

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

        const targetPosition: Omit<RoomPosition, "depth"> = {
            row: this.model.position.row + Math.floor(Math.random() * 7) - 3,
            column: this.model.position.column + Math.floor(Math.random() * 7) - 3,
        };

        if(this.room.model.structure.door?.row === targetPosition.row && this.room.model.structure.door?.column === targetPosition.column) {
            return;
        }

        this.path.walkTo(targetPosition);
    }
}
