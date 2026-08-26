import AssetFetcher from "@Client/Assets/AssetFetcher";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { GroupBadgeData } from "@pixel63/events";
import { GroupBadgeBaseData, GroupBadgeSymbolData } from "@pixel63/events/build/Client/Groups/GroupBadgeData";

type GroupBadgeSprite = {
    image: ImageBitmap;

    index: number;
    position: number;
};

export default class GroupBadgeRenderer {
    constructor() {
    }

    public async renderOffScreen(data: GroupBadgeData) {
        const canvas = new OffscreenCanvas(40, 40);
        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const images = await this.prepareImages(data);

        for(const sprite of images) {
            context.save();

            /*context.translate(
                -Math.round(sprite.image.width / 2),
                -Math.round(sprite.image.height / 2),
            );*/

            const offset = this.getPositionOffset(sprite.image, sprite.position);

            context.drawImage(sprite.image, offset.left, offset.top);

            context.restore();
        }

        return canvas.transferToImageBitmap();
    }

    private getPositionOffset(image: ImageBitmap, position: number) {
        const row = Math.floor((position - 1) / 3) + 1;
        const column = ((position - 1) % 3) + 1;

        let left = Math.round((40 / 2) * (column - 1));
        let top = Math.round((40 / 2) * (row - 1));

        switch(column) {
            case 2: {
                left -= Math.round(image.width / 2);

                break;
            }

            case 3: {
                left -= image.width;

                break;
            }
        }

        switch(row) {
            case 2: {
                top -= Math.round(image.height / 2);

                break;
            }

            case 3: {
                top -= image.height;

                break;
            }
        }

        return {
            left,
            top
        };
    }

    private async prepareImages(data: GroupBadgeData) {
        const promises: Promise<GroupBadgeSprite>[] = [];

        if(data.base) {
            promises.push(this.prepareBaseImage(data.base));
        }

        if(data.symbol1?.image) {
            promises.push(this.prepareSymbolImage(data.symbol1, 1));
        }

        if(data.symbol2?.image) {
            promises.push(this.prepareSymbolImage(data.symbol2, 2));
        }

        if(data.symbol3?.image) {
            promises.push(this.prepareSymbolImage(data.symbol3, 3));
        }

        if(data.symbol4?.image) {
            promises.push(this.prepareSymbolImage(data.symbol4, 4));
        }

        const sprites = await Promise.all(promises);

        return sprites.sort((a, b) => a.index - b.index);
    }

    private async prepareBaseImage(base: GroupBadgeBaseData): Promise<GroupBadgeSprite> {
        const { image } = await AssetFetcher.fetchImageSprite(`/assets/groups/${base.image}.png`, {
            x: 0,
            y: 0,

            color: base.color
        });

        return {
            image,
            index: 0,
            position: 5
        };
    }

    private async prepareSymbolImage(symbol: GroupBadgeSymbolData, index: number): Promise<GroupBadgeSprite> {
        const { image } = await AssetFetcher.fetchImageSprite(`/assets/groups/${symbol.image}.png`, {
            x: 0,
            y: 0,

            color: symbol.color
        });

        return {
            image,
            index,
            position: symbol.position
        };
    }
}