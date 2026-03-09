import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import PetAssets from "@Client/Assets/PetAssets";
import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import { FurnitureSprite } from "@Client/Interfaces/Furniture/FurnitureSprites";
import { hexToRgb } from "@Client/Utilities/ColorUtilities";

export default class PetDefaultRenderer extends FurnitureDefaultRenderer {
    private palettes: {
        tags: string[];
        colors: string[];
    }[] = [];

    constructor(public readonly type: string, public readonly breedPalettes: { tags: string[]; paletteId: number; }[]) {
        super(type);
    }

    public async render(data: FurnitureData, direction: number | undefined, size: number, animation: number, color: number, frame: number, grayscaled: boolean): Promise<FurnitureRendererSprite[]> {
        return super.render(data, direction, size, animation, color, frame, grayscaled);
    }

    public getPaletteData(data: FurnitureData, tag: string) {
        const breedPalette = this.breedPalettes.find((breed) => breed.tags.includes(tag));

        if(!breedPalette) {
            return null;
        }

        return data.palettes?.find((palette) => palette.id === breedPalette.paletteId && palette.tags.includes(tag));
    }

    public async getFurnitureSprite(data: FurnitureData, type: string, spriteData: FurnitureSprite, flipHorizontal: boolean, color: string | undefined, grayscaled: boolean, tag: string | undefined, usesPalette: boolean) {
        const { image, imageData } = await FurnitureAssets.getFurnitureSprite(type, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal,

            grayscaled,

            color,

            requireImageData: true
        });
            console.log({ tag, usesPalette });

        if(imageData && tag && usesPalette) {
            let palette = this.palettes.find((palette) => palette.tags.includes(tag));

            if(!palette) {
                const paletteData = this.getPaletteData(data, tag);

                if(!paletteData) {
                    console.warn("Palette does not exist.", {
                        tag
                    });

                    return { image, imageData };
                }

                palette = {
                    tags: paletteData.tags,
                    colors: await PetAssets.getPaletteData(this.type, paletteData.source)
                };

                this.palettes.push(palette);
            }

            const canvas = new OffscreenCanvas(image.width, image.height);

            for(let index = 0; index < imageData.data.length; index += 4) {
                const green = imageData.data[index + 1];

                if(palette.colors[green] !== "FFFFFF") {
                    const rgba = hexToRgb(palette.colors[green]);

                    imageData.data[index] = rgba.red;
                    imageData.data[index + 1] = rgba.green;
                    imageData.data[index + 2] = rgba.blue;
                }
            }

            const context = canvas.getContext("2d");

            context?.putImageData(imageData, 0, 0);

            return {
                image: canvas.transferToImageBitmap(),
                imageData
            };
        }
        
        return { image, imageData };
    }
}
