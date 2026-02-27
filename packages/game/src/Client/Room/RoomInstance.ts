import ClientInstance from "@Client/ClientInstance";
import RoomRenderer from "./Renderer";
import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import Figure from "@Client/Figure/Figure";
import RoomFigureItem from "./Items/Figure/RoomFigureItem";
import { UserEnteredRoomEventData } from "@Shared/Communications/Responses/Rooms/Users/UserEnteredRoomEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { UserLeftRoomEventData } from "@Shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData";
import { webSocketClient } from "../..";
import { LoadRoomEventData, RoomInformationData } from "@Shared/Communications/Responses/Rooms/LoadRoomEventData";
import { StartWalkingEventData } from "@Shared/Communications/Requests/Rooms/User/StartWalkingEventData";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import { UpdateRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import { RoomMoodlightData } from "@Shared/Interfaces/Room/RoomMoodlightData";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import ObservableProperty from "@Client/Utilities/ObservableProperty";
import { RoomFurnitureBackgroundTonerData } from "@Shared/Interfaces/Room/Furniture/RoomFurnitureBackgroundTonerData";
import RoomBot from "@Client/Room/Bots/RoomBot";
import { ActorIdentifierEventData } from "@Shared/Communications/Responses/Rooms/Actors/ActorIdentifierEventData";
import { RoomClickEventData } from "@Shared/Communications/Requests/Rooms/RoomClickEventData";

type RoomItem<DataType = RoomUserData | RoomFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};

export type RoomInstanceFurniture<T = unknown> = RoomItem<RoomFurnitureData<T>, RoomFurnitureItem>;

export type RoomUser = RoomItem<RoomUserData, RoomFigureItem>;

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

    private readonly users: RoomUser[] = [];
    public furnitures: RoomFurniture[] = [];
    public bots: RoomBot[] = [];

    public information: RoomInformationData;
    public hasRights: boolean;

    public focusedUser = new ObservableProperty<HoveredFigure | null>(null);
    public hoveredUser = new ObservableProperty<HoveredFigure | null>(null);

    constructor(public readonly clientInstance: ClientInstance, event: LoadRoomEventData) {
        this.id = event.id;
        
        this.information = event.information;
        this.hasRights = event.hasRights;
        
        this.roomRenderer = new RoomRenderer(clientInstance.element, clientInstance, this, event.structure);

        this.setStructure(event.structure);

        for(const user of event.users) {
            this.users.push(this.addUser(user));
        }

        for(const furniture of event.furnitures) {
            this.furnitures.push(new RoomFurniture(this, furniture));
        }

        for(const bot of event.bots) {
            this.bots.push(new RoomBot(this, bot));
        }

        this.registerEventListeners();
    }

    public setStructure(structure: RoomStructure) {
        this.roomRenderer.setStructure(structure);

        this.clientInstance.roomInstance.update();
    }

    public setMoodlight(moodlight: RoomMoodlightData) {
        this.roomRenderer.lighting.setMoodlightData(moodlight);
    }

    public setBackgroundToner(backgroundToner: RoomFurnitureBackgroundTonerData) {
        this.roomRenderer.lighting.setBackgroundTonerData(backgroundToner);
    }

    public terminate() {
        this.removeEventListeners();

        this.roomRenderer.terminate();

        this.clientInstance.roomInstance.value = undefined;
    }

    private registerEventListeners() {
        webSocketClient.addEventListener<WebSocketEvent<UserEnteredRoomEventData>>("UserEnteredRoomEvent", this.userEnteredRoomListener);
        webSocketClient.addEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", this.userLeftRoomListener);
        webSocketClient.addEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.addEventListener("click", this.click.bind(this));
    }

    private removeEventListeners() {
        webSocketClient.removeEventListener<WebSocketEvent<UserEnteredRoomEventData>>("UserEnteredRoomEvent", this.userEnteredRoomListener);
        webSocketClient.removeEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", this.userLeftRoomListener);
        webSocketClient.removeEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.removeEventListener("click", this.click.bind(this));
    }

    private leaveRoomListener = this.leaveRoom.bind(this);
    private leaveRoom() {
        this.terminate();
    }

    private userEnteredRoomListener = this.userEnteredRoom.bind(this);
    private userEnteredRoom(event: WebSocketEvent<UserEnteredRoomEventData>) {
        this.users.push(this.addUser(event.data));
    }

    private userLeftRoomListener = this.userLeftRoom.bind(this);
    private userLeftRoom(event: WebSocketEvent<UserLeftRoomEventData>) {
        this.removeUser(event.data);
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

                    webSocketClient.send<RoomClickEventData>("RoomClickEvent", {
                        furnitureId: roomFurniture.data.id,
                        position: event.floorEntity?.position
                    });

                    this.lastSentClickEvent = performance.now();
                }
                else if(event.otherEntity.item instanceof RoomFigureItem && event.otherEntity.item.type === "figure") {
                    const roomFurniture = this.getUserByItem(event.otherEntity.item);

                    webSocketClient.send<RoomClickEventData>("RoomClickEvent", {
                        userId: roomFurniture.data.id,
                        position: event.floorEntity?.position
                    });

                    this.lastSentClickEvent = performance.now();
                }
            }
            else if(event.floorEntity?.position) {
                webSocketClient.send<RoomClickEventData>("RoomClickEvent", {
                    position: event.floorEntity.position
                });

                this.lastSentClickEvent = performance.now();
            }
        }

        if(this.roomRenderer.cursor?.cursorDisabled) {
            return;
        }

        if(event.floorEntity?.position && !(event.otherEntity?.item instanceof RoomFigureItem)) {
            webSocketClient.send<StartWalkingEventData>("StartWalkingEvent", {
                target: event.floorEntity.position
            });
        }
    }

    private addUser(userData: RoomUserData): RoomUser {
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

    private removeUser(event: UserLeftRoomEventData) {
        const user = this.getUserById(event.userId);

        this.roomRenderer.items.splice(this.roomRenderer.items.indexOf(user.item), 1);
        this.users.splice(this.users.indexOf(user), 1);

        if(this.focusedUser.value?.type === "user" && this.focusedUser.value?.user.data.id === event.userId) {
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

    public getActor(data: ActorIdentifierEventData) {
        switch(data.type) {
            case "user":
                return this.getUserById(data.userId);

            case "bot":
                return this.getBotById(data.botId);
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

            webSocketClient.send<UpdateRoomFurnitureEventData>("UpdateRoomFurnitureEvent", {
                roomFurnitureId: furniture.data.id,
                position,
                direction
            });
        }, () => {
            roomFurniturePlacer.destroy();
        });
    }
    
    public getFurnitureAtUpmostPosition(position: Omit<RoomPosition, "depth">, dimensions: RoomPosition = { row: 1, column: 1, depth: 0 }, ignoreRoomFurnitureItemId?: number) {
        const furniture = this.furnitures
            .filter((furniture) => furniture.item.id !== ignoreRoomFurnitureItemId)
            .filter((furniture) => furniture.isPositionInside(position, dimensions))
            .toSorted((a, b) => b.data.position.depth - a.data.position.depth);

        return furniture[0];
    }
}
