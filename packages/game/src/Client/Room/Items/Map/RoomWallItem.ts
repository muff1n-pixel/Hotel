import RoomItem from "../RoomItem";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import RoomWallSprite from "../Floor/RoomWallSprite";
import RoomDoorMaskSprite from "../Floor/RoomDoorMaskSprite";
import RoomRenderer from "@Client/Room/Renderer/RoomRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomSprite from "../RoomSprite";

export default class RoomWallItem extends RoomItem {
    private wallImage?: OffscreenCanvas;
    private wallDoorImage?: OffscreenCanvas;

    constructor(public roomRenderer: RoomRenderer, public readonly wallRenderer: WallRenderer, private readonly resolve?: () => void) {
        super(roomRenderer, "wall");

        this.render();
    }
    
    process(): void {
    }

    render() {
        this.wallRenderer?.renderOffScreen().then(({ wall, doorMask }) => {
            this.setSprites([]);

            this.wallImage = wall;
            this.wallDoorImage = doorMask;

            this.renderSpritesWithLighting();

            this.resolve?.();
        });
    }

    public renderSpritesWithLighting() {
        const sprites: RoomSprite[] = [];

        if(this.wallImage) {
            sprites.push(new RoomWallSprite(this, this.renderWithLighting(this.wallImage)));
        }

        if(this.wallRenderer!.structure.data.door && this.wallDoorImage) {
            sprites.push(new RoomDoorMaskSprite(this, this.renderWithLighting(this.wallDoorImage)));
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
