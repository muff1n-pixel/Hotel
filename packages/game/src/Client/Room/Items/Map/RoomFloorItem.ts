import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import RoomItem from "../RoomItem";
import RoomFloorSprite from "../Floor/RoomFloorSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export default class RoomFloorItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public roomRenderer: RoomRenderer, public readonly floorRenderer: FloorRenderer) {
        super(roomRenderer, "floor");

        this.render();
    }
    
    process(): void {
    }

    render() {
        this.floorRenderer.renderOffScreen().then((image) => {
            this.sprites = [];

            this.sprites.push(new RoomFloorSprite(this, this.renderWithLighting(image)));
        });
    }
        
    private renderWithLighting(image: OffscreenCanvas) {
        if(this.roomRenderer.lighting.moodlight?.enabled && this.roomRenderer.lighting.moodlight?.backgroundOnly) {
            const canvas = new OffscreenCanvas(image.width, image.height);

            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.drawImage(image, 0, 0);

            this.roomRenderer.lighting.render(context);

            context.globalCompositeOperation = "destination-in";
            context.drawImage(image, 0, 0);

            return canvas;
        }

        return image;
    }
}
