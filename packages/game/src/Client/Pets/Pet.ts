import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";
import PetAssets from "@Client/Assets/PetAssets";
import { FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import PetDefaultRenderer from "@Client/Pets/Renderer/PetDefaultRenderer";
import { PetPaletteData } from "@pixel63/events";

export default class Pet {
    public frame: number = 0;
    public direction: number = 2;
    public size: number = 64;
    private color: string = '0';
    private grayscaled: AssetSpriteGrayscaledProperties | undefined = undefined;

    private readonly renderer: PetDefaultRenderer;
    private data?: FurnitureData;

    constructor(public readonly type: string, public readonly palettes: PetPaletteData[] | undefined, public posture: string = "std", public headonly: boolean = false) {
        this.renderer = new PetDefaultRenderer(this.type, this.palettes);
    }

    public shouldRender() {
        return this.renderer.shouldRender(this.getOptions());
    }

    public getOptions(): FurnitureRenderOptions {
        return {
            direction: this.direction,
            size: this.size, 
            animation: this.getAnimationId(), 
            color: this.color ?? '0',
            frame: this.frame,
            grayscaled: this.grayscaled,
            tags: (this.headonly)?(["head", "hair"]):(undefined),
            colorTags: undefined
        };
    }
    
    public render() {
        if(!this.data) {
            this.data = PetAssets.getData(this.type);
            
            if(!this.data) {
                throw new Error("Pet data is not loaded.");
            }
        }

        return this.renderer.render(this.data, this.getOptions());
    }

    public async getData() {
        if(this.shouldLoadAssets()) {
            await this.loadAssets();
        }

        return this.data;
    }

    public async renderToCanvas(options?: FurnitureRenderToCanvasOptions) {
        if(this.shouldLoadAssets()) {
            await this.loadAssets();
        }

        return await this.renderer.renderToCanvas(options, this.data!, this.getOptions());
    }

    private getAnimationId() {
        if(!this.data) {
            return 0;
        }

        const visualization = this.data.visualization.visualizations.find((visualization) => visualization.size === this.size);

        if(!visualization) {
            return 0;
        }

        const posture = visualization.postures.find((posture) => posture.id === this.posture);
       
        if(!posture) {
            return 0;
        }

        return posture.animationId;
    }

    public getPaletteColors(tag: string | undefined) {
        if(!this.data) {
            return null;
        }

        const palette = this.palettes?.find((palette) => (tag)?(palette.tags.includes(tag)):(!palette.tags.length));

        if(!palette) {
            return null;
        }

        const paletteData = this.renderer.getPaletteData(this.data, tag);

        if(!paletteData) {
            return null;
        }

        const colors = [
            paletteData.color1
        ];

        if(paletteData.color2) {
            colors.push(paletteData.color2);
        }

        return colors;
    }
    
    public async loadAssets() {
        const data = await PetAssets.fetchData(this.type);
        await PetAssets.fetchImage(this.type);

        if(data.palettes) {
            for(const palette of data.palettes) {
                try {
                    await PetAssets.fetchPaletteData(this.type, palette.source);
                }
                catch(error) {
                    console.error(error);
                }
            }
        }

        const options = this.getOptions();

        await this.renderer.loadAssets?.(options);

        this.data = data;
    }

    public shouldLoadAssets() {
        if(!this.data) {
            return true;
        }

        return false;
    }
}
