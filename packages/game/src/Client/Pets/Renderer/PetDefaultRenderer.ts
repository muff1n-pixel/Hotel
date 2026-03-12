import FurnitureAssets from "@Client/Assets/FurnitureAssets";
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
        tags: string[];
        colors: string[];
    }[] = [];

    constructor(public readonly type: string, public readonly palettes: PetPaletteData[] | undefined) {
        super(type);
    }

    public async render(data: FurnitureData, options: FurnitureRenderOptions): Promise<FurnitureRendererSprite[]> {
        return super.render(data, options);
    }

    public getPaletteData(data: FurnitureData, tag: string) {
        const palette = this.palettes?.find((breed) => breed.tags.includes(tag));

        if(!palette) {
            return data.palettes?.find((palette) => palette.master && palette.tags.includes(tag));
        }

        return data.palettes?.find((_palette) => _palette.id === palette.paletteId);
    }

    public async getFurnitureSprite(data: FurnitureData, type: string, spriteData: FurnitureSprite, flipHorizontal: boolean, color: string | undefined, grayscaled: boolean, tag: string | undefined, usesPalette: boolean) {
        const { image, imageData } = await PetAssets.getSprite(type, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal,

            grayscaled,

            color,

            requireImageData: true
        });

        if(imageData && tag && usesPalette) {
            let palette = this.palettesData.find((palette) => palette.tags.includes(tag));

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

            const newImageData = new ImageData(imageData.width, imageData.height);

            const canvas = new OffscreenCanvas(image.width, image.height);

            for(let index = 0; index < imageData.data.length; index += 4) {
                const green = imageData.data[index + 1];

                if(palette.colors[green] !== "FFFFFF") {
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
