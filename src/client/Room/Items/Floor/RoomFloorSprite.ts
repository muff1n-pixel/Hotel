import ContextNotAvailableError from "../../../Exceptions/ContextNotAvailableError.js";
import { MousePosition } from "@/Interfaces/MousePosition";
import RoomItemInterface from "@/Room/Interfaces/RoomItemInterface.js";
import RoomItemSpriteInterface from "@/Room/Interfaces/RoomItemSpriteInterface";
import FloorRenderer from "@/Room/Structure/FloorRenderer";
import RoomSprite from "../RoomSprite.js";

export default class RoomFloorSprite extends RoomSprite {
    priority = 0;

    private readonly image: OffscreenCanvas;
    private readonly offset: MousePosition;

    constructor(public readonly item: RoomItemInterface, private readonly floorRenderer: FloorRenderer) {
        super(item);

        this.image = this.floorRenderer.renderOffScreen();

        this.offset = {
            left: -(floorRenderer.structure.wall.thickness + floorRenderer.rows * 32),
            top: -(floorRenderer.depth * 16)
        }
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        context.drawImage(this.image, this.offset.left, this.offset.top);
    }

    mouseover(position: MousePosition) {
        const context = this.image.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.setTransform(1, .5, -1, .5, this.offset.left + (this.floorRenderer.rows * 32), this.offset.top);

        for(let path = this.floorRenderer.tiles.length - 1; path != -1; path--) {
            if(!context.isPointInPath(this.floorRenderer.tiles[path].path, position.left, position.top)) {
                continue;
            }

            //console.log(this.floorRenderer.tiles[path]);

            return {
                row: this.floorRenderer.tiles[path].row,
                column: this.floorRenderer.tiles[path].column,
                depth: this.floorRenderer.tiles[path].depth
            };
        }

        return null;
    }
}