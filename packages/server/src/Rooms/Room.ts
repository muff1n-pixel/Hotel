import User from "../Users/User.js";
import { RoomModel } from "../Database/Models/Rooms/RoomModel.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import RoomUser from "./Users/RoomUser.js";
import RoomFurniture from "./Furniture/RoomFurniture.js";
import RoomFloorplanHelper from "./RoomFloorplanHelper.js";
import RoomFloorplan from "./Floorplan/RoomFloorplan.js";
import RoomBot from "./Bots/RoomBot.js";
import RoomActor from "./Actor/RoomActor.js";
import WiredTriggerLogic from "./Furniture/Logic/Wired/WiredTriggerLogic.js";
import WiredTriggerStateChangedLogic from "./Furniture/Logic/Wired/Trigger/WiredTriggerStateChangedLogic.js";
import { MessageType, RoomInformationData, RoomPositionData, RoomPositionOffsetData, RoomStructureData, UnknownMessage } from "@pixel63/events";

export default class Room {
    public readonly users: RoomUser[] = [];
    public readonly bots: RoomBot[] = [];
    public readonly furnitures: RoomFurniture[] = [];

    public readonly floorplan: RoomFloorplan;

    // TODO: is there a better way to handle actions instead of an interval?
    private actionsInterval?: NodeJS.Timeout;

    constructor(public readonly model: RoomModel) {
        this.furnitures = model.roomFurnitures.map((roomFurniture) => new RoomFurniture(this, roomFurniture));
        this.bots = model.roomBots.map((userBot) => new RoomBot(this, userBot));

        this.floorplan = new RoomFloorplan(this);

        this.requestActionsFrame();
    }

    public addUserClient(user: User, position?: RoomPositionData) {
        const roomUser = new RoomUser(this, user, position);
        
        this.users.push(roomUser);

        return roomUser;
    }
    
    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        const encoded = message.encode(payload).finish();

        for(const roomUser of this.users) {
            roomUser.user.sendEncodedProtobuff(message.$type, encoded);
        }
    }

    public getRoomFurniture(roomFurnitureItemId: string) {
        const furniture = this.furnitures.find((furniture) => furniture.model.id === roomFurnitureItemId);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }

    public getBot(userBotId: string) {
        const bot = this.bots.find((bot) => bot.model.id === userBotId);

        if(!bot) {
            throw new Error("Bot does not exist in room.");
        }

        return bot;
    }

    public getRoomUserAtPosition(position: RoomPositionOffsetData) {
        return this.users.find((user) => user.position.row === position.row && user.position.column === position.column);
    }

    public getActorAtPosition(position: RoomPositionOffsetData) {
        const user = this.users.find((user) => user.position.row === position.row && user.position.column === position.column);
        const bot = this.bots.find((bot) => bot.position.row === position.row && bot.position.column === position.column);

        return user || bot;
    }

    public getActorsAtPosition(position: RoomPositionOffsetData, dimensions?: RoomPositionData): RoomActor[] {
        const actors: RoomActor[] = [];

        for(const actor of this.users) {
            if(actor.position.row < position.row) {
                continue;
            }

            if(actor.position.column < position.column) {
                continue;
            }

            if(dimensions) {
                if(position.row + dimensions.row <= actor.position.row) {
                    continue;
                }

                if(position.column + dimensions.column <= actor.position.column) {
                    continue;
                }
            }

            actors.push(actor);
        }

        for(const actor of this.bots) {
            if(actor.position.row < position.row) {
                continue;
            }

            if(actor.position.column < position.column) {
                continue;
            }

            if(dimensions) {
                if(position.row + dimensions.row <= actor.position.row) {
                    continue;
                }

                if(position.column + dimensions.column <= actor.position.column) {
                    continue;
                }
            }

            actors.push(actor);
        }

        return actors;
    }

    public refreshActorsSitting(position: RoomPositionOffsetData, dimensions: RoomPositionData) {
        const actors = this.getActorsAtPosition(position, dimensions);

        for(const actor of actors) {
            const sitableFurniture = this.getSitableFurnitureAtPosition(RoomPositionOffsetData.fromJSON(actor.position));

            if(sitableFurniture) {
                actor.addAction("Sit");
                actor.path.setPosition({
                    ...actor.position,
                    depth: sitableFurniture.model.position.depth + sitableFurniture.model.furniture.dimensions.depth - 0.5
                }, sitableFurniture.model.direction);
            }
            else {
                actor.removeAction("Sit");
                actor.path.setPosition({
                    ...actor.position,
                    depth: this.getUpmostDepthAtPosition(RoomPositionOffsetData.fromJSON(actor.position))
                });
            }
        }
    }

    public getBotAtPosition(position: RoomPositionOffsetData) {
        return this.bots.find((bot) => bot.model.position.row === position.row && bot.model.position.column === position.column);
    }

    public getRoomUser(user: User) {
        return this.getRoomUserById(user.model.id);
    }

    public getRoomUserById(userId: string) {
        const user = this.users.find((user) => user.user.model.id === userId);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    public requestActionsFrame() {
        if(this.actionsInterval === undefined) {
            this.actionsInterval = setInterval(this.handleActionsInterval.bind(this), 500);

            this.handleActionsInterval();
        }
    }

    public cancelActionsFrame() {
        if(this.actionsInterval === undefined) {
            return;
        }

        clearInterval(this.actionsInterval);

        delete this.actionsInterval;
    }

    private async handleActionsInterval() {
        for(let furniture of this.furnitures) {
            furniture.preoccupiedByActionHandler = false;
        }

        for(let user of this.users) {
            user.preoccupiedByActionHandler = false;
        }

        const furnitureWithActions = this.furnitures.filter((furniture) => furniture.getCategoryLogic()?.handleActionsInterval !== undefined);

        for(let furniture of furnitureWithActions) {
            await furniture.getCategoryLogic()?.handleActionsInterval?.();
        }

        // TODO: change so that the clients get the full path immediately, and only use this interval to cancel due to obstructions in the path?
        for(const user of this.users) {
            await user.handleActionsInterval();
        }

        for(const bot of this.bots) {
            await bot.handleActionsInterval();
        }

        /*if(!this.users.some((user) => user.path?.length)) {
            clearInterval(this.actionsInterval);

            delete this.actionsInterval;
        }*/
    }

    public getSitableFurnitureAtPosition(position: RoomPositionOffsetData) {
        const furniture =
            this.getAllFurnitureAtPosition(position)
                .filter((furniture) => furniture.model.furniture.flags.sitable)
                .toSorted((a, b) => b.model.position.depth - a.model.position.depth);

        if(!furniture.length) {
            return undefined;
        }

        return furniture[0];
    }

    public getUpmostFurnitureAtPosition(position: RoomPositionOffsetData) {
        const furniture =
            this.getAllFurnitureAtPosition(position)
                .toSorted((a, b) => b.model.position.depth - a.model.position.depth);

        if(!furniture.length) {
            return undefined;
        }

        return furniture[0];
    }

    public getAllFurnitureAtPosition(position: RoomPositionOffsetData) {
        const furniture = this.furnitures
            .filter((furniture) => furniture.isPositionInside(position));

        return furniture;
    }

    public getUpmostDepthAtPosition(position: RoomPositionOffsetData, furniture?: RoomFurniture) {
        if(!furniture) {
            if(!this.model.structure.grid[position.row] || !this.model.structure.grid[position.row]![position.column]) {
                return 0;
            }

            return RoomFloorplanHelper.parseDepth(this.model.structure.grid[position.row]![position.column]!)
        }

        if(furniture.model.furniture.flags.sitable) {
            return furniture.model.position.depth;
        }

        if(furniture.model.furniture.interactionType === "multiheight" && furniture.model.furniture.customParams?.[0]) {
            return furniture.model.position.depth + furniture.model.furniture.dimensions.depth + (parseInt(furniture.model.furniture.customParams[0]) * furniture.model.animation);
        }

        return furniture.model.position.depth + furniture.model.furniture.dimensions.depth;
    }

    public async setFloorId(id: number) {
        const structure = this.getStructure();
        structure.floor!.id = id.toString();

        await this.model.update({ structure });

        this.sendProtobuff(RoomStructureData, RoomStructureData.create(this.model.structure));
    }

    public async setWallId(id: number) {
        const structure = this.getStructure();
        structure.wall!.id = id.toString();

        await this.model.update({ structure });

        this.sendProtobuff(RoomStructureData, RoomStructureData.create(this.model.structure));
    }

    public async setStructure(structure: RoomStructureData) {
        await this.model.update({ structure });

        this.floorplan.regenerateStaticGrid();

        this.sendProtobuff(RoomStructureData, RoomStructureData.create(this.model.structure));
    }

    public getStructure(): Required<RoomStructureData> {
        return {...this.model.structure};
    }

    public getActiveFurniture(interactionType: string) {
        const dimmerFurnitures = this.furnitures.filter((furniture) => furniture.model.furniture.interactionType === interactionType);
        const activeDimmerFurniture = dimmerFurnitures.find((furniture) => furniture.model.animation === 1);

        return activeDimmerFurniture;
    }

    public getInformationData(): RoomInformationData {
        return {
            $type: "RoomInformationData",
            
            type: this.model.type,

            name: this.model.name,
            description: this.model.description,
            category: this.model.category.id,
            thumbnail: (this.model.thumbnail)?(Buffer.from(this.model.thumbnail).toString('utf8')):(undefined),
            
            owner: {
                $type: "RoomInformationOwnerData",
                id: this.model.owner.id,
                name: this.model.owner.name
            },

            maxUsers: this.model.maxUsers
        };
    }
    
    public getFurnitureWithCategory<T>(category: (new (...args: any[]) => T)) {
        return this.furnitures.filter((furniture) => furniture.getCategoryLogic() instanceof category).map((furniture) => furniture.getCategoryLogic() as T);
    }

    public async handleUserWalksOnFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture) {
        await roomFurniture.handleUserWalksOnFurniture(roomUser);

        const wiredTriggerLogic = this.getFurnitureWithCategory(WiredTriggerLogic);

        for(const logic of wiredTriggerLogic) {
            logic.handleUserWalksOnFurniture?.(roomUser, roomFurniture);
        }
    }

    public async handleUserWalksOffFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture) {
        await roomFurniture.handleUserWalksOnFurniture(roomUser);

        const wiredTriggerLogic = this.getFurnitureWithCategory(WiredTriggerLogic);

        for(const logic of wiredTriggerLogic) {
            logic.handleUserWalksOffFurniture?.(roomUser, roomFurniture);
        }
    }

    public async handleUserUseFurniture(roomUser: RoomUser, roomFurniture: RoomFurniture) {
        const wiredStateChangedLogic = this.getFurnitureWithCategory(WiredTriggerStateChangedLogic);

        for(const logic of wiredStateChangedLogic) {
            logic.handleUserUsesFurniture(roomUser, roomFurniture);
        }
    }
}
