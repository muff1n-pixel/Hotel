import FurnitureRenderer from "../Furniture/FurnitureRenderer.js";
import RoomRenderer from "./Renderer";
import RoomFurnitureItem from "./Items/Furniture/RoomFurnitureItem.js";

export default class RoomCursor {
    private readonly furnitureItem: RoomFurnitureItem;

    constructor(private readonly roomRenderer: RoomRenderer) {
        const furnitureRenderer = new FurnitureRenderer("tile_cursor", 64, 0);
        
        this.furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 1,
            column: 2,
            depth: 0
        });

        this.furnitureItem.disabled = true;

        this.roomRenderer.items.push(this.furnitureItem);

        this.roomRenderer.addEventListener("render", this.render.bind(this));
    }

    private render() {
        const entity = this.roomRenderer.getItemAtPosition();

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
}
