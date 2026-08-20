import RoomSprite from "../../RoomSprite";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import RoomPetItem from "../RoomPetItem";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export default class RoomPetExperiencePointsSprite extends RoomSprite {
    private frame: number = 0;

    constructor(public readonly item: RoomPetItem, public experience: number) {
        super(item, undefined, 100, 0);

        AssetFetcher.fetchImage(`/assets/figure/sprites/experience_points.png`).then((image) => {
            this.offset = {
                left: 64  -Math.floor(image.width / 2),
                top: -Math.floor(image.height / 2)
            };

            const canvas = new OffscreenCanvas(image.width, image.height);
            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.drawImage(image, 0, 0);

            context.textAlign = "center";
            context.textBaseline = "middle";

            context.font = "12px Ubuntu";
            context.fillStyle = "#FFFFFF";

            context.fillText(`+${experience}`, Math.floor(image.width / 2), Math.floor(image.height / 2));

            this.setTexture(canvas);
        });
    }

    public updateFrame() {
        this.frame++;

        if(!this._sprite.visible) {
            return;
        }

        if(this.frame < 12) {
            this.alpha = this._sprite.alpha = this.frame / 12;
        }
        else if(this.frame > 12) {
            this.alpha = this._sprite.alpha = 1 - ((this.frame - 12) / 18);

            if(this.alpha <= 0) {
                this.setDisabled(true);
            }
        }
    }

    mouseover() {
        return null;
    }
}
