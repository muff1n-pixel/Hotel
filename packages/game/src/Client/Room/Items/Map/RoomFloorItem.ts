import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import RoomItem from "../RoomItem";
import RoomFloorSprite from "../Floor/RoomFloorSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomFloorShadowSprite from "@Client/Room/Items/Floor/RoomFloorShadowSprite";
import RoomSprite from "../RoomSprite";

export default class RoomFloorItem extends RoomItem {
    private floorImage?: OffscreenCanvas;
    private elevatedFloorImage?: OffscreenCanvas;
    private shadow?: OffscreenCanvas;

    constructor(public roomRenderer: RoomRenderer, public readonly floorRenderer: FloorRenderer, private readonly resolve?: () => void) {
        super(roomRenderer, "floor");

        this.render();
    }
    
    process(): void {
    }

    render() {
        this.floorRenderer.renderOffScreen().then(({ floor, elevatedFloor, shadow }) => {
            this.floorImage = floor;
            this.elevatedFloorImage = elevatedFloor;
            this.shadow = shadow;

            this.renderSpritesWithLighting();

            this.resolve?.();
        });
    }

    public renderSpritesWithLighting() {
        const sprites: RoomSprite[] = [];

        if(this.floorImage) {
            sprites.push(new RoomFloorSprite(this, this.renderWithLighting(this.floorImage)));
        }

        if(this.elevatedFloorImage) {
            sprites.push(new RoomFloorSprite(this, this.renderWithLighting(this.elevatedFloorImage), true));
        }

        if(this.shadow) {
            sprites.push(new RoomFloorShadowSprite(this, this.shadow));
        }

        this.setSprites(sprites);
    }
        
    private renderWithLighting(image: OffscreenCanvas) {
        if(this.roomRenderer.lighting.shouldRenderBackground()) {
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
