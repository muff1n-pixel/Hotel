import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomMapItem from "../Map/RoomWallItem";

export default class RoomDoorMaskSprite extends RoomSprite {
    priority = -1000;

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

    render(context: OffscreenCanvasRenderingContext2D) {
        const scale = this.item.roomRenderer.getSizeScale();
        
        context.scale(scale, scale);

        context.drawImage(this.image, this.offset.left - this.item.wallRenderer!.structure.wall!.thickness, this.offset.top);
    }

    mouseover() {
        return null;
    }
}