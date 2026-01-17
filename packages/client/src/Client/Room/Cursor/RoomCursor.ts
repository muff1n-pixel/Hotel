import FurnitureRenderer from "@Client/Furniture/FurnitureRenderer";
import RoomRenderer from "../Renderer";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFigureItem from "../Items/Figure/RoomFigureItem";
import FollowingFigure from "./Events/FollowingFigure";
import StoppedHoveringFigure from "./Events/StoppedHoveringFigure";
import StartedHoveringFigure from "./Events/StartedHoveringFigure";
import StartedFollowingFigure from "./Events/StartedFollowingFigure";
import StoppedFollowingFigure from "./Events/StoppedFollowingFigure";
import { clientInstance } from "../../..";

// TODO: rework hovering/following figure to regular hover events? maybe not for performance sake?
export default class RoomCursor extends EventTarget {
    private readonly furnitureItem: RoomFurnitureItem;
    private hoveringFigure?: RoomFigureItem;
    private followingFigure?: RoomFigureItem;
    public cursorDisabled: boolean = false;

    constructor(private readonly roomRenderer: RoomRenderer) {
        super();

        const furnitureRenderer = new FurnitureRenderer("tile_cursor", 64, 0);
        
        this.furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 1,
            column: 2,
            depth: 0
        });

        this.furnitureItem.disabled = true;

        this.roomRenderer.items.push(this.furnitureItem);

        this.roomRenderer.addEventListener("render", this.render.bind(this));
        this.roomRenderer.addEventListener("frame", this.frame.bind(this));
        this.roomRenderer.element.addEventListener("click", this.click.bind(this));
    }

    private render() {
        const entity = this.roomRenderer.getItemAtPosition((item) => item.type === "map");

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

        if(!entity) {
            this.roomRenderer.element.style.cursor = "default";

            if(this.hoveringFigure) {
                clientInstance.dispatchEvent(new StoppedHoveringFigure());
    
                delete this.hoveringFigure;
            }

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

    private click() {
        const floorEntity = this.roomRenderer.getItemAtPosition((item) => item.type === "map");
        const otherEntity = this.roomRenderer.getItemAtPosition((item) => item.type !== "map");

        if(floorEntity || otherEntity) {
            this.dispatchEvent(new RoomClickEvent(floorEntity, otherEntity));
        }

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
