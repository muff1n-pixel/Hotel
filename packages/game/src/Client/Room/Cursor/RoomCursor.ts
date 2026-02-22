import Furniture from "@Client/Furniture/Furniture";
import RoomRenderer from "../Renderer";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFigureItem from "../Items/Figure/RoomFigureItem";
import { clientInstance, webSocketClient } from "../../..";
import { UpdateRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData";
import { PickupRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData";

export default class RoomCursor extends EventTarget {
    private readonly furnitureItem: RoomFurnitureItem;

    public cursorDisabled: boolean = false;

    constructor(private readonly roomRenderer: RoomRenderer) {
        super();

        const furnitureRenderer = new Furniture("tile_cursor", 64, 0);
        
        this.furnitureItem = new RoomFurnitureItem(this.roomRenderer, furnitureRenderer, {
            row: 1,
            column: 2,
            depth: 0
        });

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
    }

    private render() {
        const entity = this.roomRenderer.getItemAtPosition((item) => item.type === "floor");
        
        if(!entity || this.cursorDisabled) {
            this.furnitureItem.disabled = true;

            return;
        }

        if(entity.position) {
            this.furnitureItem.setPosition({
                row: Math.floor(entity.position.row),
                column: Math.floor(entity.position.column),
                depth: entity.position.depth
            });

            this.furnitureItem.disabled = false;
        }
    }

    private frame() {
        const entity = this.roomRenderer.getItemAtPosition((item) => ["furniture", "figure", "bot"].includes(item.type));

        if(this.roomRenderer.roomInstance?.hoveredUser.value && (!entity || this.roomRenderer.items.indexOf(entity.item) !== this.roomRenderer.items.indexOf(this.roomRenderer.roomInstance?.hoveredUser.value.item))) {
            this.roomRenderer.roomInstance.hoveredUser.value = null;
        }

        if(!entity) {
            this.roomRenderer.element.style.cursor = "default";

            return;
        }

        this.roomRenderer.element.style.cursor = "pointer";

        if(this.roomRenderer.roomInstance && !this.roomRenderer.roomInstance.hoveredUser.value) {
            if(entity.item instanceof RoomFigureItem) {
                if(entity.item.type === "figure") {
                    const user = this.roomRenderer.roomInstance.getUserByItem(entity.item);

                    this.roomRenderer.roomInstance.hoveredUser.value = {
                        type: "user",
                        item: entity.item,
                        user
                    };
                }
                else if(entity.item.type === "bot") {
                    const bot = this.roomRenderer.roomInstance.getBotByItem(entity.item);

                    this.roomRenderer.roomInstance.hoveredUser.value = {
                        type: "bot",
                        item: entity.item,
                        bot
                    };
                }
            }
        }
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
                        webSocketClient.send<UpdateRoomFurnitureEventData>("UpdateRoomFurnitureEvent", {
                            roomFurnitureId: roomFurnitureItem.data.id,
                            direction: nextDirection
                        });

                        roomFurnitureItem.item.setPositionPath(roomFurnitureItem.item.position, [
                            {
                                ...roomFurnitureItem.item.position,
                                depth: roomFurnitureItem.item.position.depth + 0.25
                            },
                            {
                                ...roomFurnitureItem.item.position,
                            }
                        ],
                        100);
                    }
                    
                    return;
                }
                else if(event.ctrlKey) {
                    if(this.roomRenderer.roomInstance.hasRights || roomFurnitureItem.data.userId === this.roomRenderer.roomInstance.clientInstance.user.value?.id) {
                        webSocketClient.send<PickupRoomFurnitureEventData>("PickupRoomFurnitureEvent", {
                            roomFurnitureId: roomFurnitureItem.data.id,
                        });
                    }
                    
                    return;
                }
            }
        }

        this.dispatchEvent(new RoomClickEvent(floorEntity, otherEntity));

        if(this.roomRenderer.roomInstance) {
            if(otherEntity?.item instanceof RoomFigureItem) {
                if(this.roomRenderer.roomInstance.focusedUser.value?.item?.id !== otherEntity.item.id) {
                    if(otherEntity.item.type === "figure") {
                        const user = this.roomRenderer.roomInstance.getUserByItem(otherEntity.item);

                        this.roomRenderer.roomInstance.focusedUser.value = {
                            type: "user",
                            item: otherEntity.item,
                            user
                        };
                    }
                    else if(otherEntity.item.type === "bot") {
                        const bot = this.roomRenderer.roomInstance.getBotByItem(otherEntity.item);

                        if(bot.data.userId === clientInstance.user.value?.id) {
                            this.roomRenderer.roomInstance.focusedUser.value = {
                                type: "bot",
                                item: otherEntity.item,
                                bot
                            };
                        }
                    }
                }
            }
            else if(this.roomRenderer.roomInstance.focusedUser.value && (!floorEntity || otherEntity)) {
                this.roomRenderer.roomInstance.focusedUser.value = null;
            }
        }
    }
}
