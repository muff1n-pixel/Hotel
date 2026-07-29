import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../../RoomSprite";
import RoomFigureItem from "../RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";

export default class RoomFigureHealthSprite extends RoomSprite {
    constructor(public readonly item: RoomFigureItem, public figureOffsets: MousePosition, public health: number) {
        super(item);

        AssetFetcher.fetchImage(`/assets/figure/sprites/health/number_${this.health}.png`).then((image) => {
            this.offset = {
                left: this.figureOffsets.left + 64 - (Math.floor(image.width / 2)),
                top: this.figureOffsets.top + -64 - image.height
            };

            this.setTexture(image);
        });
    }

    mouseover() {
        return null;
    }
}
