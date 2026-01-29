import FurnitureAssets from "../Assets/FurnitureAssets";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData";
import { FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";
import FurnitureRoomContentRenderer from "@Client/Furniture/Renderer/FurnitureRoomContentRenderer";
import { getGlobalCompositeModeFromInk } from "@Client/Renderers/GlobalCompositeModes";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import FurnitureRenderer from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";

export type FurnitureRendererSprite = {
    image: ImageBitmap;
    imageData: ImageData;

    x: number;
    y: number;

    ink?: GlobalCompositeOperation;

    zIndex: number;
    alpha?: number;
    ignoreMouse?: boolean;
}

export default class Furniture {
    private data?: FurnitureData;
    private visualization?: FurnitureVisualization["visualizations"][0];

    public placement?: "wall" | "floor";

    public frame: number = 0;

    public readonly renderer: FurnitureRenderer;

    constructor(public readonly type: string, public readonly size: number, public direction: number | undefined = undefined, public animation: number = 0, public color: number = 0) {
        if((this.type === "wallpaper" || this.type === "floor") && color !== 0) {
            this.renderer = new FurnitureRoomContentRenderer(this.type);
        }
        else {
            this.renderer = new FurnitureDefaultRenderer(this.type);
        }
    }

    public async getData() {
        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
        }

        return this.data;
    }

    public async render(frame: number = 0) {
        this.frame++;

        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
        }

        this.placement = this.data.visualization.placement;

        // TODO: construct the renderer in the constructor

        const sprites = await this.renderer.render(this.data, this.direction, this.size, this.animation, this.color, this.frame);

        return sprites;
    }

    public async renderToCanvas() {
        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
        }

        const canvas = await this.renderer.renderToCanvas(this.data, this.direction, this.size, this.animation, this.color, this.frame);

        return canvas;
    }

    getDimensions(raw: boolean = false) {
        let result = { row: 0, column: 0, depth: 0 };

        if(!this.data) {
            return result;
        }
        
        result = {
            row: this.data.logic.model.dimensions.x,
            column: this.data.logic.model.dimensions.y,
            depth: this.data.logic.model.dimensions.z
        };

        if(!raw && (this.direction === 0 || this.direction === 4)) {
            result = {
                row: this.data.logic.model.dimensions.y,
                column: this.data.logic.model.dimensions.x,
                depth: this.data.logic.model.dimensions.z
            };
        }

        return result;
    };

    public getNextAnimation() {
        if(!this.visualization) {
            return 0;
        }

        const currentAnimationIndex = this.visualization.animations.findIndex((animation) => animation.id === this.animation);

        if(currentAnimationIndex === -1) {
            return this.visualization.animations[0]?.id ?? 0;
        }

        if(!this.visualization.animations[currentAnimationIndex + 1]) {
            return 0;
        }

        return this.visualization.animations[currentAnimationIndex + 1].id;
    }

    public getNextDirection() {
        if(!this.visualization) {
            return 0;
        }

        if(this.placement === "wall") {
            return this.direction;
        }

        const currentIndex = this.visualization.directions.findIndex((direction) => direction.id === this.direction);

        if(currentIndex === -1) {
            return this.direction;
        }

        if(!this.visualization.directions[currentIndex + 1]) {
            return this.visualization.directions[0].id;
        }

        return this.visualization.directions[currentIndex + 1].id;
    }
}
