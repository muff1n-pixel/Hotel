import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomWallItem from "../Map/RoomWallItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";

export default class RoomWallSprite extends RoomSprite {
    priority = -3100;

    private readonly offset: MousePosition;

    constructor(public readonly item: RoomWallItem, private readonly image: OffscreenCanvas) {
        super(item);

        this.offset = {
            left: -(this.item.wallRenderer.rows * 32),
            top: -((this.item.wallRenderer.depth + 3.5) * 32) - item.wallRenderer.structure.wall!.thickness
        }

    }

    render(context: OffscreenCanvasRenderingContext2D) {
        const scale = this.item.roomRenderer.getSizeScale();

        context.scale(scale, scale);

        context.drawImage(this.image, this.offset.left - this.item.wallRenderer.structure.wall!.thickness, this.offset.top);
    }

    mouseover(position: MousePosition) {
        if(!this.image) {
            return null;
        }

        const context = this.image.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.setTransform(1, -.5, 0, 1, this.offset.left + this.item.wallRenderer.rows * 32, this.offset.top + (this.item.wallRenderer.depth * 16) + this.item.wallRenderer.structure.wall!.thickness);

        for(let path = this.item.wallRenderer.leftWalls.length - 1; path != -1; path--) {
            if(!context.isPointInPath(this.item.wallRenderer.leftWalls[path].path, position.left, position.top)) {
                continue;
            }

            const matrix = context.getTransform();
            const invertedMatrix = matrix.inverse();

            const local = new DOMPoint(position.left, position.top).matrixTransform(invertedMatrix);

            const width = this.item.wallRenderer.leftWalls[path].width;
            const height = this.item.wallRenderer.leftWalls[path].height;

            const left = local.x - this.item.wallRenderer.leftWalls[path].left;
            const top = local.y - this.item.wallRenderer.leftWalls[path].top;

            return RoomPositionWithDirectionData.create({
                row: Math.floor(this.item.wallRenderer.leftWalls[path].row) + ((width - left) / 32),
                column: Math.floor(this.item.wallRenderer.leftWalls[path].column),
                depth: this.item.wallRenderer.leftWalls[path].depth + ((height - top) / 32),
                direction: 2
            });
        }

        context.setTransform(1, .5, 0, 1, this.offset.left + this.item.wallRenderer.rows * 32, this.offset.top + (this.item.wallRenderer.depth * 16) + this.item.wallRenderer.structure.wall!.thickness);        

        for(let path = this.item.wallRenderer.rightWalls.length - 1; path != -1; path--) {
            if(!context.isPointInPath(this.item.wallRenderer.rightWalls[path].path, position.left, position.top)) {
                continue;
            }

            const matrix = context.getTransform();
            const invertedMatrix = matrix.inverse();

            const local = new DOMPoint(position.left, position.top).matrixTransform(invertedMatrix);

            const width = this.item.wallRenderer.rightWalls[path].width;
            const height = this.item.wallRenderer.rightWalls[path].height;

            const left = this.item.wallRenderer.rightWalls[path].left - local.x;
            const top = local.y - this.item.wallRenderer.rightWalls[path].top;

            return RoomPositionWithDirectionData.create({
                row: Math.floor(this.item.wallRenderer.rightWalls[path].row),
                column: Math.floor(this.item.wallRenderer.rightWalls[path].column) + ((width - left) / 32),
                depth: this.item.wallRenderer.rightWalls[path].depth + ((height - top) / 32),
                direction: 4
            });
        }

        return null;
    }
}