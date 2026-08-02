import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../../RoomSprite";
import RoomFigureItem from "../RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";

export default class RoomFigureTypingSprite extends RoomSprite {
    constructor(public readonly item: RoomFigureItem, public figureOffsets: MousePosition) {
        super(
            item,
            {
                left: figureOffsets.left + 64 + 16,
                top: figureOffsets.top + -80 + 16
            }
        );

        AssetFetcher.fetchImage("/assets/figure/sprites/typing.png").then((image) => {
            this.setTexture(image);
        });
    }

    mouseover() {
        return null;
    }
}
