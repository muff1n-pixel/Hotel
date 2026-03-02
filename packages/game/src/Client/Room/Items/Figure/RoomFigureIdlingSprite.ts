import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../RoomSprite";
import RoomFigureItem from "./RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";

export default class RoomFigureIdlingSprite extends RoomSprite {
    private offset: MousePosition = { left: 0, top: 0 };
    private image?: ImageBitmap;

    private currentAssetName?: string;
    private currentAssetFrame: number = 0;
    private lastAssetFrameChange: number = performance.now();

    constructor(public readonly item: RoomFigureItem, public figureOffsets: MousePosition) {
        super(item);

        this.process();
    }

    public process() {
        if(performance.now() - this.lastAssetFrameChange >= 2000) {
            this.currentAssetFrame++;

            if(this.currentAssetFrame > 1) {
                this.currentAssetFrame = 0;
            }

            this.lastAssetFrameChange = performance.now();
        }

        const assetName = this.getAssetName();

        if(this.currentAssetName !== assetName) {
            this.offset = {
                left: this.figureOffsets.left + 128 + 64 + 16,
                top: this.figureOffsets.top + 64
            };

            if(this.item.figureRenderer.direction > 3 && this.item.figureRenderer.direction < 7) {
                this.offset.left -= 32 + 16;
            }

            AssetFetcher.fetchImage(`/assets/figure/sprites/${this.getAssetName()}.png`).then((image) => this.image = image);
        }
    }

    private getAssetName() {
        let direction = "left";

        if([7, 0, 1, 2, 3].includes(this.item.figureRenderer.direction)) {
            direction = "right";
        }

        return `idle_${direction}_${this.currentAssetFrame + 1}`;
    }

    render(context: OffscreenCanvasRenderingContext2D) {
        if(!this.image) {
            return;
        }

        const scale = this.item.roomRenderer.getSizeScale();

        context.scale(scale, scale);
        
        context.drawImage(this.image, this.offset.left, this.offset.top);
    }

    mouseover() {
        return null;
    }
}
