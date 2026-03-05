import PetAssets from "@Client/Assets/PetAssets";
import { FurnitureRenderToCanvasOptions } from "@Client/Furniture/Furniture";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import FurnitureRenderer from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FurnitureData } from "@Client/Interfaces/Furniture/FurnitureData";

export default class Pet {
    private frame: number = 0;
    private direction: number = 2;
    private size: number = 64;
    private animation: number = 0;
    private color: number = 0;
    private grayscaled: boolean = false;

    private readonly renderer: FurnitureRenderer;
    private data?: FurnitureData;

    constructor(public readonly type: string) {
        this.renderer = new FurnitureDefaultRenderer(this.type);
    }
    
    public async render() {
        this.frame++;

        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return await this.renderer.render(this.data, this.direction, this.size, this.animation, this.color ?? 0, this.frame, this.grayscaled);
    }

    public async renderToCanvas(options?: FurnitureRenderToCanvasOptions) {
        if(!this.data) {
            this.data = await PetAssets.getData(this.type);
        }

        return await this.renderer.renderToCanvas(options, this.data, this.direction, this.size, this.animation, this.color ?? 0, this.frame);
    }
}
