import ClientInstance from "@/ClientInstance.js";
import { LoadRoom } from "@shared/WebSocket/Events/Rooms/LoadRoom.js";
import RoomRenderer from "./Renderer.js";
import RoomMapItem from "./Items/Map/RoomFurnitureItem.js";
import FloorRenderer from "./Structure/FloorRenderer.js";
import WallRenderer from "./Structure/WallRenderer.js";
import { RoomUserData } from "@shared/Interfaces/Room/RoomUserData.js";
import FigureRenderer from "@/Figure/FigureRenderer.js";
import RoomFigureItem from "./Items/Figure/RoomFigureItem.js";
import { UserEnteredRoom } from "@shared/WebSocket/Events/Rooms/Users/UserEnteredRoom.js";
import WebSocketEvent from "@shared/WebSocket/Events/WebSocketEvent.js";
import { RoomFurnitureData } from "@shared/Interfaces/Room/RoomFurnitureData.js";
import FurnitureRenderer from "@/Furniture/FurnitureRenderer.js";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem.js";
import RoomClickEvent from "@/Events/RoomClickEvent.js";
import { StartWalking } from "@shared/WebSocket/Events/Rooms/Users/StartWalking.js";
import { UserWalkTo } from "@shared/WebSocket/Events/Rooms/Users/UserWalkTo.js";
import { UserLeftRoom } from "@shared/WebSocket/Events/Rooms/Users/UserLeftRoom.js";

type RoomItem<DataType = RoomUserData | RoomFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};


export default class RoomInstance {
    private readonly roomRenderer: RoomRenderer;

    private readonly users: RoomItem<RoomUserData, RoomFigureItem>[] = [];
    private readonly furnitures: RoomItem<RoomFurnitureData, RoomFurnitureItem>[] = [];

    constructor(public readonly clientInstance: ClientInstance, event: LoadRoom) {
        this.roomRenderer = new RoomRenderer(clientInstance.element, clientInstance, this);
        
        this.roomRenderer.items.push(new RoomMapItem(
            new FloorRenderer(event.structure, event.structure.floor.id, 64),
            new WallRenderer(event.structure, event.structure.wall.id, 64)
        ));

        this.users = event.users.map((userData) => this.addUser(userData));
        this.furnitures = event.furnitures.map(this.addFurniture.bind(this));

        clientInstance.webSocketClient.addEventListener<WebSocketEvent<UserEnteredRoom>>("UserEnteredRoom", (event) => {
            this.users.push(this.addUser(event.data));
        });

        clientInstance.webSocketClient.addEventListener<WebSocketEvent<UserLeftRoom>>("UserLeftRoom", (event) => {
            this.removeUser(event.data);
        });

        clientInstance.webSocketClient.addEventListener<WebSocketEvent<UserWalkTo>>("UserWalkTo", (event) => {
            const user = this.getUserById(event.data.userId);

            user.item.setPositionPath(event.data.from, event.data.to);
        });

        this.roomRenderer.cursor?.addEventListener("click", (event: Event) => {
            if(!(event instanceof RoomClickEvent)) {
                return;
            }

            if(event.floorEntity) {
                this.clientInstance.webSocketClient.send<StartWalking>("StartWalking", {
                    target: event.floorEntity.position
                });
            }
        });
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

    private removeUser(event: UserLeftRoom) {
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
        const furnitureRenderer = new FurnitureRenderer(furnitureData.type, 64, furnitureData.direction, furnitureData.animation, furnitureData.color);
        const item = new RoomFurnitureItem(furnitureRenderer, furnitureData.position);

        this.roomRenderer.items.push(item);

        return {
            data: furnitureData,
            item
        };
    }
}
