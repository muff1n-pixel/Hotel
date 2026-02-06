import FurnitureAssets from "../Assets/FurnitureAssets";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData";
import { FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";
import FurnitureRoomContentRenderer from "@Client/Furniture/Renderer/FurnitureRoomContentRenderer";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import FurnitureRenderer from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import FurnitureLogic from "@Client/Furniture/Logic/Interfaces/FurnitureLogic";
import FurnitureMultistateLogic from "@Client/Furniture/Logic/FurnitureMultistateLogic";
import FurnitureDefaultLogic from "@Client/Furniture/Logic/FurnitureDefaultLogic";
import FurnitureRoomDimmerLogic from "@Client/Furniture/Logic/FurnitureRoomDimmerLogic";

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

    constructor(public readonly type: string, public size: number, public direction: number | undefined = undefined, public animation: number = 0, public color: number = 0) {
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

    public getLogic(): FurnitureLogic {
        if(!this.data) {
            throw new Error("Furniture data is not available.");
        }

        switch(this.data.index.logic) {
            case "furniture_multistate":
                return new FurnitureMultistateLogic(this, this.data);
                
            case "furniture_roomdimmer":
                return new FurnitureRoomDimmerLogic(this, this.data);
        }

        return new FurnitureDefaultLogic(this);
    }

    public async render() {
        this.frame++;

        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
            this.visualization = this.data.visualization.visualizations.find((visualization) => visualization.size == this.size);
        }

        if(this.direction === undefined) {
            const directionPriority = [4, 2];

            this.direction = this.data.visualization.defaultDirection ?? this.visualization?.directions.toSorted((a, b) => directionPriority.indexOf(b.id) - directionPriority.indexOf(a.id))?.[0].id ?? 0;
        }

        this.placement = this.data.visualization.placement;

        return await this.renderer.render(this.data, this.direction, this.size, this.animation, this.color, this.frame);
    }

    public async renderToCanvas() {
        if(!this.data) {
            this.data = await FurnitureAssets.getFurnitureData(this.type);
            this.visualization = this.data.visualization.visualizations.find((visualization) => visualization.size == this.size);
        }

        if(this.direction === undefined) {
            const directionPriority = [4, 2];

            this.direction = this.data.visualization.defaultDirection ?? this.visualization?.directions.toSorted((a, b) => directionPriority.indexOf(b.id) - directionPriority.indexOf(a.id))?.[0].id ?? 0;
        }

        this.placement = this.data.visualization.placement;

        return await this.renderer.renderToCanvas(this.data, this.direction, this.size, this.animation, this.color, this.frame);
    }

    public getVisualizationData(data: FurnitureData) {
        const visualization = data.visualization.visualizations.find((visualization) => visualization.size == this.size);

        if(!visualization) {
            throw new Error("Furniture does not have visualization data.");
        }

        return visualization;
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

    public getNextDirection() {
        if(!this.visualization) {
            return this.direction;
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
