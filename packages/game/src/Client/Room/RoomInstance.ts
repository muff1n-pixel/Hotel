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
import { UserWalkToEventData } from "@Shared/Communications/Responses/Rooms/Users/UserWalkToEventData";
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

type RoomItem<DataType = RoomUserData | RoomFurnitureData, ItemType = RoomFigureItem | RoomFurnitureItem> = {
    data: DataType;
    item: ItemType;
};

export type RoomInstanceFurniture = RoomItem<RoomFurnitureData, RoomFurnitureItem>;


export type RoomUser = RoomItem<RoomUserData, RoomFigureItem>;

export default class RoomInstance {
    public readonly key = Math.random();

    public readonly id: string;

    public readonly roomRenderer: RoomRenderer;

    private readonly users: RoomUser[] = [];
    public furnitures: RoomFurniture[] = [];

    public information: RoomInformationData;
    public hasRights: boolean;

    public focusedUser = new ObservableProperty<RoomUser | null>(null);
    public hoveredUser = new ObservableProperty<RoomUser | null>(null);

    constructor(public readonly clientInstance: ClientInstance, event: LoadRoomEventData) {
        this.id = event.id;
        
        this.information = event.information;
        this.hasRights = event.hasRights;
        
        this.roomRenderer = new RoomRenderer(clientInstance.element, clientInstance, this, event.structure);

        this.setStructure(event.structure);

        this.users = event.users.map((userData) => this.addUser(userData));
        this.furnitures = event.furnitures.map((furnitureData) => new RoomFurniture(this, furnitureData));

        this.registerEventListeners();
    }

    public setStructure(structure: RoomStructure) {
        this.roomRenderer.setStructure(structure);

        this.clientInstance.roomInstance.update();
    }

    public setMoodlight(moodlight: RoomMoodlightData) {
        this.roomRenderer.lighting.setMoodlightData(moodlight);
    }

    public terminate() {
        this.removeEventListeners();

        this.roomRenderer.terminate();

        this.clientInstance.roomInstance.value = undefined;
    }

    private registerEventListeners() {
        webSocketClient.addEventListener<WebSocketEvent<UserEnteredRoomEventData>>("UserEnteredRoomEvent", this.userEnteredRoomListener);
        webSocketClient.addEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", this.userLeftRoomListener);
        webSocketClient.addEventListener<WebSocketEvent<UserWalkToEventData>>("UserWalkToEvent", this.userWalkToListener);
        webSocketClient.addEventListener("LeaveRoomEvent", this.leaveRoomListener);
        this.roomRenderer.cursor?.addEventListener("click", this.click.bind(this));
    }

    private removeEventListeners() {
        webSocketClient.removeEventListener<WebSocketEvent<UserEnteredRoomEventData>>("UserEnteredRoomEvent", this.userEnteredRoomListener);
        webSocketClient.removeEventListener<WebSocketEvent<UserLeftRoomEventData>>("UserLeftRoomEvent", this.userLeftRoomListener);
        webSocketClient.removeEventListener<WebSocketEvent<UserWalkToEventData>>("UserWalkToEvent", this.userWalkToListener);
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

        user.item.setPositionPath(event.data.from, event.data.to/*, event.delay*/);
    }

    private click(event: Event) {
        if(!(event instanceof RoomClickEvent)) {
            return;
        }

        if(this.roomRenderer.cursor?.cursorDisabled) {
            return;
        }

        if(event.floorEntity?.position) {
            webSocketClient.send<StartWalkingEventData>("StartWalkingEvent", {
                target: event.floorEntity.position
            });
        }
    }

    private addUser(userData: RoomUserData): RoomUser {
        const figureRenderer = new Figure(userData.figureConfiguration, userData.direction, userData.actions);
        const item = new RoomFigureItem(this.roomRenderer, figureRenderer, userData.position);

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
