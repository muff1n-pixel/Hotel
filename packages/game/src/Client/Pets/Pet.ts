import PetAssets from "@Client/Assets/PetAssets";
import { FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import FurnitureRenderer from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";
import PetDefaultRenderer from "@Client/Pets/Renderer/PetDefaultRenderer";
import { PetPaletteData } from "@pixel63/events";

export default class Pet {
    private frame: number = 0;
    private direction: number = 2;
    private size: number = 64;
    private color: number = 0;
    private grayscaled: boolean = false;

    private readonly renderer: FurnitureRenderer;
    private data?: FurnitureData;

    constructor(public readonly type: string, public readonly palettes: PetPaletteData[], public posture: string = "std") {
        this.renderer = new PetDefaultRenderer(this.type, this.palettes);
    }
    
    public async render() {
        this.frame++;

        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return await this.renderer.render(this.data, this.direction, this.size, this.getAnimationId(), this.color ?? 0, this.frame, this.grayscaled);
    }

    public async renderToCanvas(options?: FurnitureRenderToCanvasOptions) {
        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return await this.renderer.renderToCanvas(options, this.data, this.direction, this.size, this.getAnimationId(), this.color ?? 0, this.frame);
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
}
