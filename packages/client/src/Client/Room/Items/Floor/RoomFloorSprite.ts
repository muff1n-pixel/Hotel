import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomMapItem from "../Map/RoomFurnitureItem";

export default class RoomFloorSprite extends RoomSprite {
    priority = -1000;

    private readonly offset: MousePosition;

    constructor(public readonly item: RoomMapItem, private readonly image: OffscreenCanvas) {
        super(item);

        this.offset = {
            left: -(this.item.floorRenderer.rows * 32),
            top: -(this.item.floorRenderer.depth * 16) - 16 - (item.wallRenderer?.structure.wall.thickness ?? 0)
        }
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        if(!this.image) {
            return;
        }

        context.drawImage(this.image, this.offset.left - this.item.floorRenderer.structure.wall.thickness, this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(!this.image) {
            return null;
        }

        const context = this.image.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.setTransform(1, .5, -1, .5, this.offset.left + (this.item.floorRenderer.rows * 32), 0);

        for(let path = this.item.floorRenderer.tiles.length - 1; path != -1; path--) {
            if(!context.isPointInPath(this.item.floorRenderer.tiles[path].path, position.left, position.top)) {
                continue;
            }

            //console.log(this.item.floorRenderer.tiles[path]);

            return {
                row: Math.floor(this.item.floorRenderer.tiles[path].row),
                column: Math.floor(this.item.floorRenderer.tiles[path].column),
                depth: this.item.floorRenderer.tiles[path].depth
            };
        }

        return null;
    }
}