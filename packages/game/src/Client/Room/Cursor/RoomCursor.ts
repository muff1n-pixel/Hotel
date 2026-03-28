import Furniture from "@Client/Furniture/Furniture";
import RoomRenderer from "../RoomRenderer";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { clientInstance, webSocketClient } from "../../..";
import { PickupRoomFurnitureData, RoomPositionData, UpdateRoomFurnitureData } from "@pixel63/events";
import RoomDoubleClickEvent from "@Client/Events/RoomDoubleClickEvent";

export default class RoomCursor extends EventTarget {
    private readonly furnitureItem: RoomFurnitureItem;

    public cursorDisabled: boolean = false;

    constructor(private readonly roomRenderer: RoomRenderer) {
        super();

        const furnitureRenderer = new Furniture("tile_cursor", 64, 0);
        
        this.furnitureItem = new RoomFurnitureItem(this.roomRenderer, furnitureRenderer, RoomPositionData.create({
            row: 1,
            column: 2,
            depth: 0
        }));

        this.furnitureItem.disabled = true;

        this.roomRenderer.items.push(this.furnitureItem);

        this.roomRenderer.addEventListener("render", this.render.bind(this));
        this.roomRenderer.addEventListener("frame", this.frame.bind(this));
        this.roomRenderer.element.addEventListener("mousedown", this.mousedown.bind(this));
        this.roomRenderer.element.addEventListener("dblclick", this.doubleclick.bind(this));
        this.roomRenderer.element.addEventListener("click", this.click.bind(this));
    }

    private mousedown(event: MouseEvent) {
        if(this.cursorDisabled) {
            return;
        }

        const otherEntity = this.roomRenderer.getItemAtPosition((item) => item.type !== "floor" && item.type !== "wall");
        
        if(this.roomRenderer.roomInstance && otherEntity) {
            if(otherEntity.item instanceof RoomFurnitureItem) {
                const roomFurnitureItem = this.roomRenderer.roomInstance?.getFurnitureByItem(otherEntity.item);

                if(event.altKey) {
                    this.roomRenderer.roomInstance.moveFurniture(roomFurnitureItem.data.id);
                }
            }
        }
    }

    private doubleclick() {
        if(this.cursorDisabled) {
            return;
        }

        const floorEntity = this.roomRenderer.getItemAtPosition((item) => item.type === "floor");
        const otherEntity = this.roomRenderer.getItemAtPosition((item) => item.type !== "floor" && item.type !== "wall");
        
        if(this.roomRenderer.roomInstance && otherEntity) {
            if(otherEntity.item instanceof RoomFurnitureItem) {
                const roomFurnitureItem = this.roomRenderer.roomInstance?.getFurnitureByItem(otherEntity.item);
                
                const logic = roomFurnitureItem.getLogic();

                if(logic.isAvailable()) {
                    logic.use(otherEntity.sprite?.tag);
                }
            }
        }

        this.dispatchEvent(new RoomDoubleClickEvent(floorEntity, otherEntity));
    }

    private render() {
        const entity = this.roomRenderer.getItemAtPosition((item) => item.type === "floor");
        
        if(!entity || this.cursorDisabled) {
            this.furnitureItem.disabled = true;

            return;
        }

        if(entity.position) {
            this.furnitureItem.setPosition(RoomPositionData.create({
                row: Math.floor(entity.position.row),
                column: Math.floor(entity.position.column),
                depth: entity.position.depth
            }));

            this.furnitureItem.disabled = false;
        }
    }

    private frame() {
        const entity = this.roomRenderer.getItemAtPosition((item) => ["furniture", "figure", "bot", "pet"].includes(item.type));

        if(entity) {
            this.roomRenderer.hoveredItem.value = entity.item;
            clientInstance.roomInstance.update();
        }
        else if(!entity && this.roomRenderer.hoveredItem.value) {
            this.roomRenderer.hoveredItem.value = null;
            clientInstance.roomInstance.update();
        }

        if(!entity) {
            this.roomRenderer.element.style.cursor = "default";

            return;
        }

        this.roomRenderer.element.style.cursor = "pointer";
    }

    private click(event: MouseEvent) {
        if(this.cursorDisabled) {
            return;
        }
        
        const floorEntity = this.roomRenderer.getItemAtPosition((item) => item.type === "floor");
        const otherEntity = this.roomRenderer.getItemAtPosition((item) => item.type !== "floor" && item.type !== "wall");

        if(this.roomRenderer.roomInstance && otherEntity?.item.position) {
            if(otherEntity.item instanceof RoomFurnitureItem) {
                const roomFurnitureItem = this.roomRenderer.roomInstance?.getFurnitureByItem(otherEntity.item);

                if(event.shiftKey && this.roomRenderer.roomInstance.hasRights) {
                    const nextDirection = otherEntity.item.furnitureRenderer.getNextDirection();

                    if((nextDirection !== otherEntity.item.furnitureRenderer.direction) && roomFurnitureItem.item.position && !roomFurnitureItem.item.positionPathData) {
                        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
                            id: roomFurnitureItem.data.id,
                            direction: nextDirection
                        }));
                    }
                    
                    return;
                }
                else if(event.ctrlKey) {
                    if(this.roomRenderer.roomInstance.hasRights || roomFurnitureItem.data.userId === this.roomRenderer.roomInstance.clientInstance.user.value?.id) {
                        webSocketClient.sendProtobuff(PickupRoomFurnitureData, PickupRoomFurnitureData.create({
                            id: roomFurnitureItem.data.id
                        }));
                    }
                    
                    return;
                }
            }
        }

        this.dispatchEvent(new RoomClickEvent(floorEntity, otherEntity));

        console.log("click2");

        if(otherEntity?.item && this.roomRenderer.focusedItem.value?.id !== otherEntity.item.id) {
            this.roomRenderer.focusedItem.value = otherEntity.item;
            clientInstance.roomInstance.update();
        }
        else if(this.roomRenderer.focusedItem.value && (!floorEntity || otherEntity)) {
            this.roomRenderer.focusedItem.value = null;
            clientInstance.roomInstance.update();
        }
    }
}
