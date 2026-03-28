import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";
import PetAssets from "@Client/Assets/PetAssets";
import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { hexToRgb } from "@Client/Utilities/ColorUtilities";
import { PetPaletteData } from "@pixel63/events";

export default class PetDefaultRenderer extends FurnitureDefaultRenderer {
    private palettesData: {
        tags: string[] | undefined;
        colors: string[];
    }[] = [];

    constructor(public readonly type: string, public readonly palettes: PetPaletteData[] | undefined) {
        super(type);
    }

    public async render(data: FurnitureData, options: FurnitureRenderOptions): Promise<FurnitureRendererSprite[]> {
        return super.render(data, options);
    }

    public getPaletteData(data: FurnitureData, tag: string | undefined) {
        const palette = this.palettes?.find((breed) => (tag)?(breed.tags.includes(tag)):(!breed.tags.length));

        if(!palette) {
            return data.palettes?.find((palette) => palette.master && (tag)?(palette.tags?.includes(tag)):(!palette.tags));
        }

        return data.palettes?.find((_palette) => _palette.id === palette.paletteId);
    }

    public getPaletteColor(tag: string | undefined) {
        const palette = this.palettes?.find((breed) => (tag)?(breed.tags.includes(tag)):(!breed.tags));

        if(!palette?.color) {
            return null;
        }

        return hexToRgb(palette.color);
    }

    public async getFurnitureSprite(data: FurnitureData, type: string, spriteData: FurnitureSprite, flipHorizontal: boolean, color: string | undefined, grayscaled: AssetSpriteGrayscaledProperties | undefined, tag: string | undefined, usesPalette: boolean) {
        const { image, imageData } = await PetAssets.getSprite(type, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal,

            grayscaled: (grayscaled)?({
                foreground: "#FFFFFF",
                background: "#999999"
            }):(undefined),

            color,

            requireImageData: true
        });

        if(imageData && usesPalette) {
            let palette = this.palettesData.find((palette) => (tag)?(palette.tags?.includes(tag)):(!palette.tags));

            if(!palette) {
                const paletteData = this.getPaletteData(data, tag);

                if(!paletteData) {
                    return { image, imageData };
                }

                palette = {
                    tags: paletteData.tags,
                    colors: await PetAssets.getPaletteData(this.type, paletteData.source)
                };

                this.palettesData.push(palette);
            }

            const color = this.getPaletteColor(tag);

            const newImageData = new ImageData(imageData.width, imageData.height);

            const canvas = new OffscreenCanvas(image.width, image.height);

            for(let index = 0; index < imageData.data.length; index += 4) {
                const green = imageData.data[index + 1];

                const isSolidBlack = imageData.data[index + 0] < 10 && imageData.data[index + 1] < 10 && imageData.data[index + 2] < 10;

                if(!isSolidBlack) {
                    const rgba = hexToRgb(palette.colors[green]);

                    newImageData.data[index] = rgba.red;
                    newImageData.data[index + 1] = rgba.green;
                    newImageData.data[index + 2] = rgba.blue;
                    newImageData.data[index + 3] = imageData.data[index + 3];
                }
                else {
                    newImageData.data[index] = imageData.data[index];
                    newImageData.data[index + 1] = imageData.data[index + 1];
                    newImageData.data[index + 2] = imageData.data[index + 2];
                    newImageData.data[index + 3] = imageData.data[index + 3];
                }

                if(color) {
                    newImageData.data[index] *= color.red / 255;
                    newImageData.data[index + 1] *= color.green / 255;
                    newImageData.data[index + 2] *= color.blue / 255;
                }
            }

            const context = canvas.getContext("2d");

            context?.putImageData(newImageData, 0, 0);

            return {
                image: canvas.transferToImageBitmap(),
                imageData
            };
        }
        
        return { image, imageData };
    }
}
