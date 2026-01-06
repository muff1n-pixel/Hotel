import FurnitureRenderer from "../Furniture/FurnitureRenderer.js";
import RoomRenderer from "./Renderer";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem.js";
import RoomClickEvent from "../Events/RoomClickEvent.js";

export default class RoomCursor extends EventTarget {
    private readonly furnitureItem: RoomFurnitureItem;

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

        if(!entity) {
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

            return;
        }

        this.roomRenderer.element.style.cursor = "pointer";
    }

    private click() {
        const floorEntity = this.roomRenderer.getItemAtPosition((item) => item.type === "map");
        const otherEntity = this.roomRenderer.getItemAtPosition((item) => item.type !== "map");

        if(floorEntity || otherEntity) {
            this.dispatchEvent(new RoomClickEvent(floorEntity, otherEntity));
        }
    }
}
