import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import RoomWallSprite from "../Floor/RoomWallSprite";
import RoomDoorMaskSprite from "../Floor/RoomDoorMaskSprite";

export default class RoomWallItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public readonly wallRenderer: WallRenderer) {
        super("wall");

        this.render();
    }
    
    process(frame: number): void {
    }

    render(frame: number = 0) {
        this.wallRenderer?.renderOffScreen().then(({ wall, doorMask }) => {
            this.sprites.push(new RoomWallSprite(this, wall));

            if(this.wallRenderer!.structure.door) {
                this.sprites.push(new RoomDoorMaskSprite(this, doorMask));
                this.sprites.push(new RoomDoorMaskSprite(this, doorMask));
            }
        });
    }
}
