import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import RoomItem from "../RoomItem";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import RoomFloorSprite from "../Floor/RoomFloorSprite";
import RoomWallSprite from "../Floor/RoomWallSprite";
import RoomDoorMaskSprite from "../Floor/RoomDoorMaskSprite";

export default class RoomMapItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public readonly floorRenderer: FloorRenderer, public readonly wallRenderer?: WallRenderer) {
        super("map");

        this.render();
    }
    
    process(frame: number): void {
    }

    render(frame: number = 0) {
        this.floorRenderer.renderOffScreen().then((image) => {
            this.sprites.push(new RoomFloorSprite(this, image));
        });

        
        this.wallRenderer?.renderOffScreen().then(({ wall, doorMask }) => {
            this.sprites.push(new RoomWallSprite(this, wall));

            if(this.wallRenderer!.structure.door) {
                this.sprites.push(new RoomDoorMaskSprite(this, doorMask));
                this.sprites.push(new RoomDoorMaskSprite(this, doorMask));
            }
        });
    }
}
