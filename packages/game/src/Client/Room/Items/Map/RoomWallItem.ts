import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import RoomWallSprite from "../Floor/RoomWallSprite";
import RoomDoorMaskSprite from "../Floor/RoomDoorMaskSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export default class RoomWallItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    constructor(public roomRenderer: RoomRenderer, public readonly wallRenderer: WallRenderer) {
        super(roomRenderer, "wall");

        this.render();
    }
    
    process(): void {
    }

    render() {
        this.wallRenderer?.renderOffScreen().then(({ wall, doorMask }) => {
            this.sprites = [];
            
            this.sprites.push(new RoomWallSprite(this, this.renderWithLighting(wall)));

            if(this.wallRenderer!.structure.door) {
                this.sprites.push(new RoomDoorMaskSprite(this, this.renderWithLighting(doorMask)));
            }
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
