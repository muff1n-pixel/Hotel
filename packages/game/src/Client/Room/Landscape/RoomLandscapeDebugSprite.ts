import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomSprite from "@Client/Room/Items/RoomSprite";
import { Texture } from "pixi.js";

export default class RoomLandscapeDebugSprite extends RoomSprite {
    public readonly defaultOffset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly item: RoomItem) {
        super(
            item,
            undefined,
            -99,
            undefined,
            undefined,
            item.roomRenderer.landscape?.image,
        );

        this.sprite.x = -(item.roomRenderer.structure.rows * 32) - item.roomRenderer.structure.data.wall!.thickness;
        this.sprite.y = -((item.roomRenderer.structure.depth + 3.5) * 32) - item.roomRenderer.structure.data.wall!.thickness;
    }

    public updateLandscape() {
        if(this.item.roomRenderer.landscape.image) {
            this.sprite.texture = Texture.from(this.item.roomRenderer.landscape.image);
            this.sprite.texture.source.scaleMode = "nearest";
        }
    }

    update(): void {
    }

    destroy(): void {
        super.destroy();
    }
}
