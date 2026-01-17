import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomWallItem from "../Map/RoomWallItem";

export default class RoomWallSprite extends RoomSprite {
    priority = -2100;

    private readonly offset: MousePosition;

    constructor(public readonly item: RoomWallItem, private readonly image: OffscreenCanvas) {
        super(item);

        this.offset = {
            left: -(this.item.wallRenderer.rows * 32),
            top: -((this.item.wallRenderer.depth + 3.5) * 32) - item.wallRenderer.structure.wall.thickness
        }
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        context.drawImage(this.image, this.offset.left - this.item.wallRenderer.structure.wall.thickness, this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(!this.image) {
            return null;
        }

        const context = this.image.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.setTransform(1, -.5, 0, 1, this.offset.left + this.item.wallRenderer.rows * 32, this.offset.top + (this.item.wallRenderer.depth * 16) + this.item.wallRenderer.structure.wall.thickness);

        for(let path = this.item.wallRenderer.leftWalls.length - 1; path != -1; path--) {
            if(!context.isPointInPath(this.item.wallRenderer.leftWalls[path].path, position.left, position.top)) {
                continue;
            }

            const matrix = context.getTransform();
            const inv = matrix.inverse();

            const local = new DOMPoint(position.left, position.top)
                .matrixTransform(inv);

            const width = this.item.wallRenderer.leftWalls[path].width;
            const height = this.item.wallRenderer.leftWalls[path].height;

            const left = local.x % width;
            const top = (local.y - (this.item.wallRenderer.depth * 32)) % height;

            return {
                row: Math.floor(this.item.wallRenderer.leftWalls[path].row) + ((Math.abs(left)) / 32) - 1,
                column: Math.floor(this.item.wallRenderer.leftWalls[path].column),
                depth: this.item.wallRenderer.leftWalls[path].depth + ((height - top) / 32),
                direction: 2
            };
        }

        context.setTransform(1, .5, 0, 1, this.offset.left + this.item.wallRenderer.rows * 32, this.offset.top + (this.item.wallRenderer.depth * 16) + this.item.wallRenderer.structure.wall.thickness);        

        for(let path = this.item.wallRenderer.rightWalls.length - 1; path != -1; path--) {
            if(!context.isPointInPath(this.item.wallRenderer.rightWalls[path].path, position.left, position.top)) {
                continue;
            }

            const matrix = context.getTransform();
            const inv = matrix.inverse();

            const local = new DOMPoint(position.left, position.top)
                .matrixTransform(inv);

            const width = this.item.wallRenderer.rightWalls[path].width;
            const height = this.item.wallRenderer.rightWalls[path].height;

            let left = local.x % width;
            const top = (local.y - ((this.item.wallRenderer.depth * 16) + (this.item.wallRenderer.rightWalls[path].row * 32))) % height;

            if(left < 0) {
                left += 32;
            }

            return {
                row: Math.floor(this.item.wallRenderer.rightWalls[path].row),
                column: Math.floor(this.item.wallRenderer.rightWalls[path].column) + (Math.abs(left) / 32),
                depth: this.item.wallRenderer.rightWalls[path].depth + ((height - top) / 32),
                direction: 4
            };
        }

        return null;
    }
}