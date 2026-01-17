import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import RoomItem from "../RoomItem";
import RoomFloorSprite from "../Floor/RoomFloorSprite";
import RoomWallSprite from "../Floor/RoomWallSprite";
import RoomDoorMaskSprite from "../Floor/RoomDoorMaskSprite";

export default class RoomFloorItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public readonly floorRenderer: FloorRenderer) {
        super("floor");

        this.render();
    }
    
    process(frame: number): void {
    }

    render(frame: number = 0) {
        this.floorRenderer.renderOffScreen().then((image) => {
            this.sprites.push(new RoomFloorSprite(this, image));
        });
    }
}
