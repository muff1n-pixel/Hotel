import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFloorItem from "../Map/RoomFloorItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";

export default class RoomFloorSprite extends RoomSprite {
    private readonly offset: MousePosition;

    constructor(public readonly item: RoomFloorItem, private readonly image: OffscreenCanvas, elevated: boolean = false) {
        super(item);

        this.priority = elevated ? -50 : -3000;

        this.offset = {
            left: -(this.item.floorRenderer.rows * 32),
            top: -(this.item.floorRenderer.depth * 32) - 32 - (item.floorRenderer.structure.wall?.thickness ?? 0)
        };
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        if(!this.image) {
            return;
        }
        
        context.drawImage(this.image, left + this.offset.left - (this.item.floorRenderer.structure.wall?.thickness ?? 0), top + this.offset.top);
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

            return RoomPositionWithDirectionData.create({
                row: Math.floor(this.item.floorRenderer.tiles[path].row),
                column: Math.floor(this.item.floorRenderer.tiles[path].column),
                depth: this.item.floorRenderer.tiles[path].depth
            });
        }

        return null;
    }
}