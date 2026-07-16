import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomSprite from "../../RoomSprite";
import RoomFigureItem from "../RoomFigureItem";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import { Texture } from "pixi.js";

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
            this.sprite.texture = Texture.from(image);
        });
    }

    mouseover() {
        return null;
    }
}
