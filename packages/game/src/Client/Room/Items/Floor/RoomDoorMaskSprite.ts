import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomMapItem from "../Map/RoomWallItem";

export default class RoomDoorMaskSprite extends RoomSprite {
    priority = -100;

    private readonly offset: MousePosition;

    constructor(public readonly item: RoomMapItem, private readonly image: OffscreenCanvas) {
        super(item);

        /*this.priority = RoomRenderer.getPositionPriority({
            row: item.wallRenderer!.structure.door!.row,
            column: item.wallRenderer!.structure.door!.column,
            depth: parseInt(item.wallRenderer!.structure.grid[item.wallRenderer!.structure.door!.row][item.wallRenderer!.structure.door!.column])
        });*/

        this.offset = {
            left: -(this.item.wallRenderer!.rows * 32),
            top: -((this.item.wallRenderer!.depth + 3.5) * 32) - item.wallRenderer!.structure.wall!.thickness
        }
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
        context.drawImage(this.image, left + this.offset.left - this.item.wallRenderer!.structure.wall!.thickness, top + this.offset.top);
    }

    mouseover() {
        return null;
    }
}