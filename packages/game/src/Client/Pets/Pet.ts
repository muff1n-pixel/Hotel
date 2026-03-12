import PetAssets from "@Client/Assets/PetAssets";
import { FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import PetDefaultRenderer from "@Client/Pets/Renderer/PetDefaultRenderer";
import { PetPaletteData } from "@pixel63/events";

export default class Pet {
    private frame: number = 0;
    public direction: number = 2;
    private size: number = 64;
    private color: number = 0;
    private grayscaled: boolean = false;

    private readonly renderer: PetDefaultRenderer;
    private data?: FurnitureData;

    constructor(public readonly type: string, public readonly palettes: PetPaletteData[] | undefined, public posture: string = "std", public headonly: boolean = false) {
        this.renderer = new PetDefaultRenderer(this.type, this.palettes);
    }
    
    public async render() {
        this.frame++;

        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return await this.renderer.render(this.data, {
            direction: this.direction,
            size: this.size, 
            animation: this.getAnimationId(), 
            color: this.color ?? 0,
            frame: this.frame,
            grayscaled: this.grayscaled,
            tags: (this.headonly)?(["head", "hair"]):(undefined)
        });
    }

    public async getData() {
        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return this.data;
    }

    public async renderToCanvas(options?: FurnitureRenderToCanvasOptions) {
        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return await this.renderer.renderToCanvas(options, this.data, {
            direction: this.direction,
            size: this.size, 
            animation: this.getAnimationId(), 
            color: this.color ?? 0,
            frame: this.frame,
            grayscaled: this.grayscaled,
            tags: (this.headonly)?(["head", "hair"]):(undefined)
        });
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

    public getPaletteColors(tag: string) {
        if(!this.data) {
            return null;
        }

        const palette = this.renderer.getPaletteData(this.data, tag);

        if(!palette) {
            return null;
        }

        const colors = [
            palette.color1
        ];

        if(palette.color2) {
            colors.push(palette.color2);
        }

        return colors;
    }
}
