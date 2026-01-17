import ClientInstance from "@Client/ClientInstance";
import { LoadRoom } from "@Shared/WebSocket/Events/Rooms/LoadRoom";
import RoomRenderer from "./Renderer";
import RoomMapItem from "./Items/Map/RoomFurnitureItem";
import FloorRenderer from "./Structure/FloorRenderer";
import WallRenderer from "./Structure/WallRenderer";
import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import FigureRenderer from "@Client/Figure/FigureRenderer";
import RoomFigureItem from "./Items/Figure/RoomFigureItem";
import { UserEnteredRoom } from "@Shared/WebSocket/Events/Rooms/Users/UserEnteredRoom";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { RoomFurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { StartWalking } from "@Shared/WebSocket/Events/Rooms/Users/StartWalking";
import { UserWalkTo } from "@Shared/WebSocket/Events/Rooms/Users/UserWalkTo";
import { UserLeftRoom } from "@Shared/WebSocket/Events/Rooms/Users/UserLeftRoom";
import { webSocketClient } from "../..";

type RoomItem<DataType = RoomUserData | RoomFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};


export default class RoomInstance {
    public readonly roomRenderer: RoomRenderer;

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

        this.furnitures.push(this.addFurniture({
            id: "x",
            furniture: {
                name: "Dimmer",
                type: "roomdimmer"
            },
            position: {
                row: 2.5,
                column: 1,
                depth: 4.5
            },
            direction: 2,
            animation: 0
        }));

        webSocketClient.addEventListener<WebSocketEvent<UserEnteredRoom>>("UserEnteredRoom", (event) => {
            this.users.push(this.addUser(event.data));
        });

        webSocketClient.addEventListener<WebSocketEvent<UserLeftRoom>>("UserLeftRoom", (event) => {
            this.removeUser(event.data);
        });

        webSocketClient.addEventListener<WebSocketEvent<UserWalkTo>>("UserWalkTo", (event) => {
            const user = this.getUserById(event.data.userId);

            user.item.setPositionPath(event.data.from, event.data.to);
        });

        this.roomRenderer.cursor?.addEventListener("click", (event: Event) => {
            if(!(event instanceof RoomClickEvent)) {
                return;
            }

            if(this.roomRenderer.cursor?.cursorDisabled) {
                return;
            }

            if(event.floorEntity) {
                webSocketClient.send<StartWalking>("StartWalking", {
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
        const furnitureRenderer = new FurnitureRenderer(furnitureData.furniture.type, 64, furnitureData.direction, furnitureData.animation, furnitureData.furniture.color);
        const item = new RoomFurnitureItem(furnitureRenderer, furnitureData.position);

        this.roomRenderer.items.push(item);

        return {
            data: furnitureData,
            item
        };
    }
}
