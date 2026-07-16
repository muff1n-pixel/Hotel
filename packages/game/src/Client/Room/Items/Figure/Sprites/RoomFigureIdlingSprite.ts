import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../../RoomSprite";
import RoomFigureItem from "../RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import { Texture } from "pixi.js";

export default class RoomFigureIdlingSprite extends RoomSprite {
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
                left: this.figureOffsets.left + 64 + 16 + 10,
                top: this.figureOffsets.top - 64
            };

            if(this.item.figureRenderer.direction > 3 && this.item.figureRenderer.direction < 7) {
                this.offset.left -= 64;
            }

            AssetFetcher.fetchImage(`/assets/figure/sprites/${this.getAssetName()}.png`).then((image) => {
                this.sprite.texture = Texture.from(image);

                this.update();
            });
        }
    }

    private getAssetName() {
        let direction = "left";

        if([7, 0, 1, 2, 3].includes(this.item.figureRenderer.direction)) {
            direction = "right";
        }

        return `idle_${direction}_${this.currentAssetFrame + 1}`;
    }

    render(context: OffscreenCanvasRenderingContext2D, left: number, top: number) {
    }

    mouseover() {
        return null;
    }
}
