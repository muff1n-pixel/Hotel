import Furniture from "@Client/Furniture/Furniture";
import RoomRenderer from "../Renderer";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFigureItem from "../Items/Figure/RoomFigureItem";
import FollowingFigure from "./Events/FollowingFigure";
import StoppedHoveringFigure from "./Events/StoppedHoveringFigure";
import StartedHoveringFigure from "./Events/StartedHoveringFigure";
import StartedFollowingFigure from "./Events/StartedFollowingFigure";
import StoppedFollowingFigure from "./Events/StoppedFollowingFigure";
import { clientInstance, webSocketClient } from "../../..";
import { UpdateRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UpdateRoomFurnitureEventData";
import { PickupRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PickupRoomFurnitureEventData";
import { UseRoomFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/UseRoomFurnitureEventData";

// TODO: rework hovering/following figure to regular hover events? maybe not for performance sake?
export default class RoomCursor extends EventTarget {
    private readonly furnitureItem: RoomFurnitureItem;
    private hoveringFigure?: RoomFigureItem;
    private followingFigure?: RoomFigureItem;
    public cursorDisabled: boolean = false;

    constructor(private readonly roomRenderer: RoomRenderer) {
        super();

        const furnitureRenderer = new Furniture("tile_cursor", 64, 0);
        
        this.furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
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

    private doubleclick(event: MouseEvent) {
        if(this.cursorDisabled) {
            return;
        }

        const otherEntity = this.roomRenderer.getItemAtPosition((item) => item.type !== "floor" && item.type !== "wall");
        
        if(this.roomRenderer.roomInstance && otherEntity) {
            if(otherEntity.item instanceof RoomFurnitureItem) {
                const roomFurnitureItem = this.roomRenderer.roomInstance?.getFurnitureByItem(otherEntity.item);
                
                const logic = roomFurnitureItem.item.furnitureRenderer.getLogic();

                if(logic.isAvailable()) {
                    logic.use(roomFurnitureItem);
                }
            }
        }
    }

    private render() {
        const entity = this.roomRenderer.getItemAtPosition((item) => item.type === "floor");

        if(this.followingFigure && this.roomRenderer.roomInstance) {
            const user = this.roomRenderer.roomInstance.getUserByItem(this.followingFigure);

            const screenPosition = this.roomRenderer.getItemScreenPosition(this.followingFigure);

            clientInstance.dispatchEvent(new FollowingFigure(user.data.id, screenPosition));
        }
        else if(this.hoveringFigure && this.roomRenderer.roomInstance) {
            const user = this.roomRenderer.roomInstance.getUserByItem(this.hoveringFigure);

            const screenPosition = this.roomRenderer.getItemScreenPosition(this.hoveringFigure);

            clientInstance.dispatchEvent(new FollowingFigure(user.data.id, screenPosition));
        }
        
        if(!entity || this.cursorDisabled) {
            this.furnitureItem.disabled = true;

            return;
        }

        this.furnitureItem.setPosition({
            row: Math.floor(entity.position.row),
            column: Math.floor(entity.position.column),
            depth: entity.position.depth
        });

        this.furnitureItem.disabled = false;
    }

    private frame() {
        const entity = this.roomRenderer.getItemAtPosition((item) => ["furniture", "figure"].includes(item.type));

        if(this.hoveringFigure && (!entity || this.roomRenderer.items.indexOf(entity.item) !== this.roomRenderer.items.indexOf(this.hoveringFigure))) {
            clientInstance.dispatchEvent(new StoppedHoveringFigure());

            delete this.hoveringFigure;
        }

        if(!entity) {
            this.roomRenderer.element.style.cursor = "default";

            return;
        }

        this.roomRenderer.element.style.cursor = "pointer";

        if(!this.hoveringFigure && this.roomRenderer.roomInstance) {
            if(entity.item instanceof RoomFigureItem) {
                this.hoveringFigure = entity.item;

                const user = this.roomRenderer.roomInstance.getUserByItem(entity.item);

                const screenPosition = this.roomRenderer.getItemScreenPosition(entity.item);

                clientInstance.dispatchEvent(new StartedHoveringFigure(user.data, screenPosition));
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

                if(event.shiftKey) {
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
                    webSocketClient.send<PickupRoomFurnitureEventData>("PickupRoomFurnitureEvent", {
                        roomFurnitureId: roomFurnitureItem.data.id,
                    });
                    
                    return;
                }
            }
        }

        this.dispatchEvent(new RoomClickEvent(floorEntity, otherEntity));

        if(this.roomRenderer.roomInstance) {
            if(otherEntity?.item instanceof RoomFigureItem) {
                if(this.followingFigure?.id !== otherEntity.item.id) {
                    this.followingFigure = otherEntity.item;

                    const user = this.roomRenderer.roomInstance.getUserByItem(otherEntity.item);

                    const screenPosition = this.roomRenderer.getItemScreenPosition(otherEntity.item);

                    clientInstance.dispatchEvent(new StartedFollowingFigure(user.data, screenPosition));
                }
            }
            else if(this.followingFigure && (!floorEntity || otherEntity)) {
                clientInstance.dispatchEvent(new StoppedFollowingFigure());
    
                delete this.followingFigure;
            }
        }
    }
}
