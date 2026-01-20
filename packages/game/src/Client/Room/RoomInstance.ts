import ClientInstance from "@Client/ClientInstance";
import RoomRenderer from "./Renderer";
import FloorRenderer from "./Structure/FloorRenderer";
import WallRenderer from "./Structure/WallRenderer";
import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import FigureRenderer from "@Client/Figure/FigureRenderer";
import RoomFigureItem from "./Items/Figure/RoomFigureItem";
import { UserEnteredRoomEventData } from "@Shared/Communications/Responses/Rooms/Users/UserEnteredRoomEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { UserWalkToEventData } from "@Shared/Communications/Responses/Rooms/Users/UserWalkToEventData";
import { UserLeftRoomEventData } from "@Shared/Communications/Responses/Rooms/Users/UserLeftRoomEventData";
import { webSocketClient } from "../..";
import RoomFloorItem from "./Items/Map/RoomFloorItem";
import RoomWallItem from "./Items/Map/RoomWallItem";
import { LoadRoomEventData } from "@Shared/Communications/Responses/Rooms/LoadRoomEventData";
import { StartWalkingEventData } from "@Shared/Communications/Requests/Rooms/User/StartWalkingEventData";
import { RoomFurnitureEventData } from "@Shared/Communications/Responses/Rooms/Furniture/RoomFurnitureEventData";

type RoomItem<DataType = RoomUserData | RoomFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};


export default class RoomInstance {
    public readonly key = Math.random();

    public readonly roomRenderer: RoomRenderer;

    private readonly users: RoomItem<RoomUserData, RoomFigureItem>[] = [];
    private readonly furnitures: RoomItem<RoomFurnitureData, RoomFurnitureItem>[] = [];

    constructor(public readonly clientInstance: ClientInstance, event: LoadRoomEventData) {
        this.roomRenderer = new RoomRenderer(clientInstance.element, clientInstance, this);
        
        this.roomRenderer.items.push(new RoomFloorItem(
            new FloorRenderer(event.structure, event.structure.floor.id, 64),
        ));

        this.roomRenderer.items.push(new RoomWallItem(
            new WallRenderer(event.structure, event.structure.wall.id, 64)
        ));

        this.users = event.users.map((userData) => this.addUser(userData));
        this.furnitures = event.furnitures.map(this.addFurniture.bind(this));

        this.furnitures.push(this.addFurniture({
            id: "x",
            furniture: {
                name: "Dimmer",
                type: "roomdimmer",
                placement: "wall"
            },
            position: {
                row: 2.5,
                column: 1,
                depth: 4.5
            },
            direction: 2,
            animation: 0
        }));

        this.registerEventListeners();
    }

    public terminate() {
        this.removeEventListeners();

        this.roomRenderer.terminate();

        this.clientInstance.roomInstance = undefined;
    }

    private registerEventListeners() {
        webSocketClient.addEventListener<WebSocketEvent<UserEnteredRoomEventData>>("UserEnteredRoomEvent", this.userEnteredRoomListener);
        webSocketClient.addEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", this.userLeftRoomListener);
        webSocketClient.addEventListener<WebSocketEvent<UserWalkToEventData>>("UserWalkToEvent", this.userWalkToListener);
        webSocketClient.addEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", this.roomFurnitureUpdatedListener);
        webSocketClient.addEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.addEventListener("click", this.click.bind(this));
    }

    private removeEventListeners() {
        webSocketClient.removeEventListener<WebSocketEvent<UserEnteredRoomEventData>>("UserEnteredRoomEvent", this.userEnteredRoomListener);
        webSocketClient.removeEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", this.userLeftRoomListener);
        webSocketClient.removeEventListener<WebSocketEvent<UserWalkToEventData>>("UserWalkToEvent", this.userWalkToListener);
        webSocketClient.removeEventListener<WebSocketEvent<RoomFurnitureEventData>>("RoomFurnitureEvent", this.roomFurnitureUpdatedListener);
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

    private userWalkToListener = this.userWalkTo.bind(this);
    private userWalkTo(event: WebSocketEvent<UserWalkToEventData>) {
        const user = this.getUserById(event.data.userId);

        user.item.setPositionPath(event.data.from, event.data.to);
    }

    private roomFurnitureUpdatedListener = this.roomFurnitureUpdated.bind(this);
    private roomFurnitureUpdated(event: WebSocketEvent<RoomFurnitureEventData>) {
        if(event.data.furnitureAdded?.length) {
            this.furnitures.push(...event.data.furnitureAdded.map((roomFurnitureData) => this.addFurniture(roomFurnitureData)));
        }
    }

    private click(event: Event) {
        if(!(event instanceof RoomClickEvent)) {
            return;
        }

        if(this.roomRenderer.cursor?.cursorDisabled) {
            return;
        }

        if(event.floorEntity) {
            webSocketClient.send<StartWalkingEventData>("StartWalkingEvent", {
                target: event.floorEntity.position
            });
        }
    }

    private addUser(userData: RoomUserData): RoomItem<RoomUserData, RoomFigureItem> {
        const figureRenderer = new FigureRenderer(userData.figureConfiguration, userData.direction);
        const item = new RoomFigureItem(figureRenderer, userData.position);

        this.roomRenderer.items.push(item);

        return {
            data: userData,
            item
        };
    }

    private removeUser(event: UserLeftRoomEventData) {
        const user = this.getUserById(event.userId);

        this.roomRenderer.items.slice(this.roomRenderer.items.indexOf(user.item), 1);
        this.users.slice(this.users.indexOf(user), 1);
    }

    private getUserById(userId: string) {
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

    private addFurniture(furnitureData: RoomFurnitureData): RoomItem<RoomFurnitureData, RoomFurnitureItem> {
        const furnitureRenderer = new FurnitureRenderer(furnitureData.furniture.type, 64, furnitureData.direction, furnitureData.animation, furnitureData.furniture.color);
        const item = new RoomFurnitureItem(furnitureRenderer, furnitureData.position);

        this.roomRenderer.items.push(item);

        return {
            data: furnitureData,
            item
        };
    }

    public getFurnitureByItem(item: RoomFurnitureItem) {
        const furniture = this.furnitures.find((furniture) => furniture.item.id === item.id);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        return furniture;
    }
}
