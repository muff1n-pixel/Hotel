import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFloorItem from "../Map/RoomFloorItem";
import { RoomPositionWithDirectionData } from "@pixel63/events";
import { FloorTile } from "@Client/Room/Structure/FloorRenderer";
import RoomPriority from "../RoomPriority";

export default class RoomFloorSprite extends RoomSprite {
    private tile: FloorTile | null = null;

    constructor(public readonly item: RoomFloorItem, private readonly image: OffscreenCanvas, elevated: boolean = false) {
        super(
            item,
            {
                left: -(item.floorRenderer.structure.rows * 32) - (item.floorRenderer.structure.data.wall?.thickness ?? 0),
                top: -(item.floorRenderer.structure.depth * 32) - 32 - (item.floorRenderer.structure.data.wall?.thickness ?? 0)
            },
            elevated ? RoomPriority.FLOOR_ELEVATED_SPRITE_PRIORITY : RoomPriority.FLOOR_SPRITE_PRIORITY,
            undefined,
            undefined,
            image
        );
    }

    mouseover(position: MousePosition) {
        if(!this.image) {
            return null;
        }

        const context = this.image.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }
        
        context.setTransform(1, .5, -1, .5, this.offset.left + (this.item.floorRenderer.structure.rows * 32), 0);

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