import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomSprite from "@Client/Room/Items/RoomSprite";

export default class RoomLandscapeDebugSprite extends RoomSprite {
    public readonly defaultOffset: MousePosition = {
        left: 0,
        top: 0
    };

    constructor(public readonly item: RoomItem) {
        super(
            item,
            {
                left: -(item.roomRenderer.structure.rows * 32) - item.roomRenderer.structure.data.wall!.thickness,
                top: -((item.roomRenderer.structure.depth + 3.5) * 32) - item.roomRenderer.structure.data.wall!.thickness
            },
            -99,
            undefined,
            undefined,
            undefined,
            false
        );

        if(this.item.roomRenderer.landscape?.texture) {
            this.setExistingTexture(this.item.roomRenderer.landscape.texture);
        }
    }

    public updateLandscape() {
        if(this.item.roomRenderer.landscape?.texture) {
            this.setExistingTexture(this.item.roomRenderer.landscape.texture);
        }
    }

    update(): void {
    }

    destroy(): void {
        super.destroy();
    }
}
