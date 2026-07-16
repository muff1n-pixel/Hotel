import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFloorItem from "../Map/RoomFloorItem";
import { RoomPositionData, RoomPositionWithDirectionData, SendRoomUserWalkData } from "@pixel63/events";
import { FloorTile } from "@Client/Room/Structure/FloorRenderer";
import { webSocketClient } from "@Game/index";

export default class RoomFloorSprite extends RoomSprite {
    private tile: FloorTile | null = null;

    constructor(public readonly item: RoomFloorItem, private readonly image: OffscreenCanvas, elevated: boolean = false) {
        super(
            item,
            {
                left: -(item.floorRenderer.rows * 32) - (item.floorRenderer.structure.wall?.thickness ?? 0),
                top: -(item.floorRenderer.depth * 32) - 32 - (item.floorRenderer.structure.wall?.thickness ?? 0)
            },
            elevated ? -50 : -3000,
            undefined,
            undefined,
            image
        );

        this.sprite.eventMode = "static";

        this.sprite.hitArea = {
            contains: (x: number, y: number) => {
                const context = this.image.getContext("2d");

                if(!context) {
                    throw new ContextNotAvailableError();
                }
                
                context.setTransform(1, .5, -1, .5, (this.item.floorRenderer.rows * 32) + (item.floorRenderer.structure.wall?.thickness ?? 0), -this.offset.top);

                for(let path = this.item.floorRenderer.tiles.length - 1; path != -1; path--) {
                    if(!context.isPointInPath(this.item.floorRenderer.tiles[path].path, x, y)) {
                        continue;
                    }

                    this.tile = this.item.floorRenderer.tiles[path];

                    return true;
                }

                this.tile = null;

                return false;
            }
        };

        this.sprite.addListener("mousemove", () => {
            if(!this.item.roomRenderer.cursor || !this.tile) {
                return;
            }

            this.item.roomRenderer.cursor.furnitureItem.setPosition(RoomPositionData.create({
                row: Math.floor(this.tile.row),
                column: Math.floor(this.tile.column),
                depth: this.tile.depth
            }));

            this.item.roomRenderer.cursor.furnitureItem.disabled = false;
        });

        this.sprite.addListener("mouseleave", () => {
            if(this.item.roomRenderer.cursor) {
                this.item.roomRenderer.cursor.furnitureItem.disabled = true;
            }
        });

        this.sprite.addListener("click", () => {
            if(!this.tile) {
                return;
            }

            webSocketClient.sendProtobuff(SendRoomUserWalkData, SendRoomUserWalkData.create({
                target: RoomPositionData.fromJSON(this.tile)
            }));
        });
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