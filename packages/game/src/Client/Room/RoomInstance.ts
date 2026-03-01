import ClientInstance from "@Client/ClientInstance";
import RoomRenderer from "./Renderer";
import Figure from "@Client/Figure/Figure";
import RoomFigureItem from "./Items/Figure/RoomFigureItem";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { webSocketClient } from "../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import RoomBot from "@Client/Room/Bots/RoomBot";
import { RoomActorIdentifierData, RoomClickData, RoomInformationData, RoomLoadData, RoomPositionData, RoomStructureData, RoomUserData, SendRoomUserWalkData, UpdateRoomFurnitureData, UserFurnitureData, UserFurnitureMoodlightData, UserFurnitureTonerData } from "@pixel63/events";

type RoomItem<DataType = RoomUserData | UserFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};

export type RoomInstanceFurniture = RoomItem<UserFurnitureData, RoomFurnitureItem>;

export type RoomUser = RoomItem<Required<RoomUserData>, RoomFigureItem>;

export type HoveredFigure = {
    type: "user";
    item: RoomFigureItem;
    user: RoomUser;
} | {
    type: "bot";
    item: RoomFigureItem;
    bot: RoomBot
};

export default class RoomInstance {
    public readonly key = Math.random();

    public readonly id: string;

    public readonly roomRenderer: RoomRenderer;

    public readonly users: RoomUser[] = [];
    public furnitures: RoomFurniture[] = [];
    public bots: RoomBot[] = [];

    public information?: RoomInformationData;
    public hasRights: boolean;

    public focusedUser = new ObservableProperty<HoveredFigure | null>(null);
    public hoveredUser = new ObservableProperty<HoveredFigure | null>(null);

    constructor(public readonly clientInstance: ClientInstance, event: RoomLoadData) {
        this.id = event.id;
        
        if(event.information) {
            this.information = event.information;
        }

        this.hasRights = event.hasRights;
        
        this.roomRenderer = new RoomRenderer(clientInstance.element, clientInstance, this, event.structure);

        if(event.structure) {
            this.setStructure(event.structure);
        }

        for(const user of event.users) {
            this.users.push(this.addUser(user as Required<RoomUserData>));
        }

        for(const furniture of event.furniture) {
            this.furnitures.push(new RoomFurniture(this, furniture));
        }

        for(const bot of event.bots) {
            this.bots.push(new RoomBot(this, bot));
        }

        this.registerEventListeners();
    }

    public setStructure(structure: RoomStructureData) {
        this.roomRenderer.setStructure(structure);

        this.clientInstance.roomInstance.update();
    }

    public setMoodlight(moodlight?: UserFurnitureMoodlightData) {
        this.roomRenderer.lighting.setMoodlightData(moodlight);
    }

    public setBackgroundToner(backgroundToner: UserFurnitureTonerData) {
        this.roomRenderer.lighting.setBackgroundTonerData(backgroundToner);
    }

    public terminate() {
        this.removeEventListeners();

        this.roomRenderer.terminate();

        this.clientInstance.roomInstance.value = undefined;
    }

    private registerEventListeners() {
        webSocketClient.addEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.addEventListener("click", this.click.bind(this));
    }

    private removeEventListeners() {
        webSocketClient.removeEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.removeEventListener("click", this.click.bind(this));
    }

    private leaveRoomListener = this.leaveRoom.bind(this);
    private leaveRoom() {
        this.terminate();
    }

    private lastSentClickEvent: number = 0;

    private click(event: Event) {
        if(!(event instanceof RoomClickEvent)) {
            return;
        }

        if(performance.now() - this.lastSentClickEvent >= 500) {
            if(event.otherEntity) {
                if(event.otherEntity.item instanceof RoomFurnitureItem) {
                    const roomFurniture = this.getFurnitureByItem(event.otherEntity.item);

                    webSocketClient.sendProtobuff(RoomClickData, RoomClickData.create({
                        furnitureId: roomFurniture.data.id,
                        position: event.otherEntity.position
                    }));

                    this.lastSentClickEvent = performance.now();
                }
                else if(event.otherEntity.item instanceof RoomFigureItem && event.otherEntity.item.type === "figure") {
                    const roomUser = this.getUserByItem(event.otherEntity.item);

                    webSocketClient.sendProtobuff(RoomClickData, RoomClickData.create({
                        userId: roomUser.data.id,
                        position: event.otherEntity.position
                    }));

                    this.lastSentClickEvent = performance.now();
                }
            }
            else if(event.floorEntity?.position) {
                webSocketClient.sendProtobuff(RoomClickData, RoomClickData.create({
                    position: event.floorEntity.position
                }));

                this.lastSentClickEvent = performance.now();
            }
        }

        if(this.roomRenderer.cursor?.cursorDisabled) {
            return;
        }

        if(event.floorEntity?.position && !(event.otherEntity?.item instanceof RoomFigureItem)) {
            webSocketClient.sendProtobuff(SendRoomUserWalkData, SendRoomUserWalkData.create({
                target: event.floorEntity.position
            }));
        }
    }

    public addUser(userData: Required<RoomUserData>): RoomUser {
        const figureRenderer = new Figure(userData.figureConfiguration, userData.direction, userData.actions);
        const item = new RoomFigureItem(this.roomRenderer, figureRenderer, userData.position);

        item.idling = userData.idling;
        item.typing = userData.typing;
        
        if(item.idling) {
            item.figureRenderer.addAction("Sleep");
        }

        this.roomRenderer.items.push(item);

        return {
            data: userData,
            item
        };
    }

    public removeUser(userId: string) {
        const user = this.getUserById(userId);

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(user.item), 1);
        this.users.splice(this.users.indexOf(user), 1);

        if(this.focusedUser.value?.type === "user" && this.focusedUser.value?.user.data.id === userId) {
            this.focusedUser.value = null;
        }
    }

    public getUserById(userId: string) {
        const user = this.users.find((user) => user.data.id === userId);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    public getUserByItem(item: RoomFigureItem) {
        const user = this.users.find((user) => user.item.id === item.id);

        if(!user) {
            throw new Error("User does not exist in room.");
        }

        return user;
    }

    public getBotByItem(item: RoomFigureItem) {
        const bot = this.bots.find((bot) => bot.item.id === item.id);

        if(!bot) {
            throw new Error("Bot does not exist in room.");
        }

        return bot;
    }

    public getActor(data?: RoomActorIdentifierData) {
        if(data?.bot) {
            return this.getBotById(data.bot.botId);
        }

        if(data?.user) {
            return this.getUserById(data.user.userId);
        }

        throw new Error("Unhandled actor type.");
    }

    public getBotById(id: string) {
        const bot = this.bots.find((bot) => bot.data.id === id);

        if(!bot) {
            throw new Error("Bot does not exist in room.");
        }

        return bot;
    }

    public getFurnitureById(id: string) {
        const furniture = this.furnitures.find((furniture) => furniture.data.id === id);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }

    public getFurnitureByItem(item: RoomFurnitureItem) {
        const furniture = this.furnitures.find((furniture) => furniture.item.id === item.id);

        if(!furniture) {
            console.log(item, this.furnitures);
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }

    public removeFurniture(roomFurnitureId: string) {
        const furniture = this.getFurnitureById(roomFurnitureId);

        if(!furniture.data.furniture) {
            throw new Error();
        }

        if(furniture.data.userId === this.clientInstance.user.value?.id) {
            this.clientInstance.flyingFurnitureIcons.value?.push({
                id: roomFurnitureId,
                furniture: furniture.data.furniture,
                targetElementId: "toolbar-inventory",
                position: this.roomRenderer.getItemScreenPosition(furniture.item)
            });
            
            this.clientInstance.flyingFurnitureIcons.update();
        }

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(furniture.item), 1);
        this.furnitures.splice(this.furnitures.indexOf(furniture), 1);

        this.clientInstance.roomInstance.update();
    }

    public removeBot(botId: string) {
        const bot = this.getBotById(botId);

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(bot.item), 1);
        this.bots.splice(this.bots.indexOf(bot), 1);

        this.clientInstance.roomInstance.update();
    }

    public moveFurniture(roomFurnitureId: string) {
        if(!this.hasRights) {
            return;
        }
        
        const furniture = this.getFurnitureById(roomFurnitureId);

        const roomFurniturePlacer = new RoomFurniturePlacer(this, furniture.item);

        roomFurniturePlacer.startPlacing((position, direction) => {
            roomFurniturePlacer.destroy();

            webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
                id: furniture.data.id,

                position,
                direction
            }));
        }, () => {
            roomFurniturePlacer.destroy();
        });
    }
    
    public getFurnitureAtUpmostPosition(position: Omit<RoomPositionData, "depth">, dimensions: RoomPositionData = RoomPositionData.create({ row: 1, column: 1, depth: 0 }), ignoreRoomFurnitureItemId?: number) {
        const furniture = this.furnitures
            .filter((furniture) => furniture.item.id !== ignoreRoomFurnitureItemId)
            .filter((furniture) => furniture.isPositionInside(position, dimensions))
            .toSorted((a, b) => b.data.position!.depth - a.data.position!.depth);

        return furniture[0];
    }
}
