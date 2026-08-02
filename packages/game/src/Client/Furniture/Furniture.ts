import FurnitureAssets from "../Assets/FurnitureAssets";
import { FurnitureData } from "../Interfaces/Furniture/FurnitureData";
import { FurnitureVisualization } from "@Client/Interfaces/Furniture/FurnitureVisualization";
import FurnitureRoomContentRenderer from "@Client/Furniture/Renderer/FurnitureRoomContentRenderer";
import FurnitureDefaultRenderer from "@Client/Furniture/Renderer/FurnitureDefaultRenderer";
import FurnitureRenderer, { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import FurnitureXRayRenderer from "@Client/Furniture/Renderer/FurnitureXRayRenderer";
import { FigureConfigurationData, RoomPositionData, UserFurnitureAnimationTag, UserFurnitureColorTag } from "@pixel63/events";
import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";
import FurnitureMannequinRenderer from "@Client/Furniture/Renderer/FurnitureMannequinRenderer";
import FurnitureExternalImageRenderer from "@Client/Furniture/Renderer/FurnitureExternalImageRenderer";
import FurnitureParticleSystem from "@Client/Furniture/Renderer/ParticleSystems/FurnitureParticleSystem";
import { BLEND_MODES } from "pixi.js";

export type FurnitureRenderToCanvasOptions = {
    spritesWithoutInkModes?: boolean;
};

export type FurnitureRenderResult = {
    sprites: FurnitureRendererSprite[];
    mask: FurnitureRendererSprite | null;
    animated: boolean;
    layerFrames: string;
    visualization: FurnitureVisualization["visualizations"][0];
};

export type FurnitureRendererSprite = {
    image: ImageBitmap;
    imageData: ImageData | null;

    x: number;
    y: number;

    ink?: BLEND_MODES;

    zIndex: number;
    alpha?: number;
    ignoreMouse?: boolean;

    layerCode: string;

    tag?: string;
}

export default class Furniture {
    public data?: FurnitureData;
    private visualization?: FurnitureVisualization["visualizations"][0];

    public placement?: "wall" | "floor";

    public frame: number = 0;

    public externalImage: string | undefined = undefined;

    public readonly renderer: FurnitureRenderer;
    public particleSystem?: FurnitureParticleSystem;

    public grayscaled: AssetSpriteGrayscaledProperties | undefined = undefined;

    public _animation: number = 0;

    public get animation() {
        return this._animation;
    }

    public set animation(animation: number) {
        this._animation = animation;
        this.frame = 0;
    }

    public _animationTags: UserFurnitureAnimationTag[] | undefined = undefined;

    public get animationTags() {
        return this._animationTags;
    }

    public set animationTags(animationTags: UserFurnitureAnimationTag[] | undefined) {
        this._animationTags = animationTags;
        this.frame = 0;
    }

    public colorTags: UserFurnitureColorTag[] | undefined = undefined;

    public readonly type: string;

    public figureConfiguration?: FigureConfigurationData;

    constructor(type: string, public size: number, public direction: number | undefined = undefined, animation: number = 0, public color: string | undefined = undefined) {
        if(this.color === undefined) {
            this.color = '0';
        }

        this.type = type;

        this.animation = animation;

        switch(this.type) {
            case "wallpaper":
            case "landscape":
            case "floor": {
                if(color !== '0') {
                    this.renderer = new FurnitureRoomContentRenderer(this.type);
                }
                else {
                    this.renderer = new FurnitureDefaultRenderer(this.type);
                }

                break;
            }

            case "hc_rntgn": {
                this.renderer = new FurnitureXRayRenderer(this.type);

                break;
            }

            case "boutique_mannequin1": {
                this.renderer = new FurnitureMannequinRenderer(this.type);
                
                break;
            }

            case "external_image_wallitem_poster":
            case "external_image_wallitem_poster_small": {
                this.renderer = new FurnitureExternalImageRenderer(this.type);

                break;
            }

            default: {
                this.renderer = new FurnitureDefaultRenderer(this.type);

                break;
            }
        }
    }

    private getOptions(): FurnitureRenderOptions {
        return {
            direction: this.direction,
            size: this.size, 
            animation: this.animation,
            animationTags: this.animationTags,
            colorTags: this.colorTags,
            color: this.color ?? '0', 
            frame: this.frame,
            grayscaled: this.grayscaled,
            tags: undefined,
            figureConfiguration: this.figureConfiguration,
            externalImage: this.externalImage
        };
    }

    public shouldRender() {
        if(this.particleSystem?.shouldRender(this.getOptions())) {
            return true;
        }

        return this.renderer.shouldRender(this.getOptions());
    }

    public async getData() {
        if(!this.data) {
            this.data = await FurnitureAssets.fetchFurnitureData(this.type);
        }

        return this.data;
    }

    public render() {
        if(!this.data) {
            this.data = FurnitureAssets.getFurnitureData(this.type);
            
            if(!this.data) {
                throw new Error("Furniture data is not loaded.");
            }

            this.visualization = this.data.visualization.visualizations.find((visualization) => visualization.size == this.size);
            
            const particleSystemData = this.data.logic.particleSystems?.find((particleSystem) => particleSystem.size == this.size);

            if(particleSystemData) {
                this.particleSystem = new FurnitureParticleSystem(this, particleSystemData);
            }
        }

        if(this.direction === undefined) {
            if(this.data.visualization.placement === "wall") {
                this.direction = 2;
            }
            else {
                const directionPriority = [4, 2];

                const sortedDirections = this.visualization?.directions?.toSorted((a, b) => directionPriority.indexOf(b?.id) - directionPriority.indexOf(a?.id));
                const firstDirection = sortedDirections?.[0];

                this.direction = this.data.visualization.defaultDirection ?? firstDirection?.id ?? 0;
            }
        }

        this.placement = this.data.visualization.placement;

        const options = this.getOptions();

        const result = this.renderer.render(this.data, options);

        if(this.particleSystem) {
            const particleSystemResult = {
                ...result,
                sprites: [...result.sprites]
            };
            
            //await this.particleSystem.render(particleSystemResult.sprites, options);

            return particleSystemResult;
        }

        return result;
    }

    public async renderToCanvas(options?: FurnitureRenderToCanvasOptions) {
        if(this.shouldLoadAssets()) {
            await this.loadAssets();
        }

        if(!this.data) {
            this.data = FurnitureAssets.getFurnitureData(this.type);

            if(!this.data) {
                throw new Error("Furniture data does not exist.");
            }
            
            this.visualization = this.data.visualization.visualizations.find((visualization) => visualization.size == this.size);
        }

        if(this.direction === undefined) {
            const directionPriority = [4, 2];

            const sortedDirections = this.visualization?.directions?.toSorted((a, b) => directionPriority.indexOf(b?.id) - directionPriority.indexOf(a?.id));
            const firstDirection = sortedDirections?.[0];

            this.direction = this.data.visualization.defaultDirection ?? firstDirection?.id ?? 0;
        }

        this.placement = this.data.visualization.placement;

        return await this.renderer.renderToCanvas(options, this.data, this.getOptions());
    }

    public getVisualizationData(data: FurnitureData) {
        const visualization = data.visualization.visualizations.find((visualization) => visualization.size == this.size);

        if(!visualization) {
            throw new Error("Furniture does not have visualization data.");
        }

        return visualization;
    }

    getDimensions(raw: boolean = false) {
        let result = RoomPositionData.create({ row: 0, column: 0, depth: 0 });

        if(!this.data) {
            return result;
        }
        
        result = RoomPositionData.create({
            row: this.data.logic.model.dimensions.x,
            column: this.data.logic.model.dimensions.y,
            depth: this.data.logic.model.dimensions.z
        });

        if(!raw && (this.direction === 0 || this.direction === 4)) {
            result = RoomPositionData.create({
                row: this.data.logic.model.dimensions.y,
                column: this.data.logic.model.dimensions.x,
                depth: this.data.logic.model.dimensions.z
            });
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

    public getPreviousDirection() {
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

        if(!this.visualization.directions[currentIndex - 1]) {
            return this.visualization.directions[this.visualization.directions.length - 1].id;
        }

        return this.visualization.directions[currentIndex - 1].id;
    }

    public getColors() {
        if(!this.visualization) {
            return [];
        }

        return this.visualization.colors.map((color) => color.layers[0].color);
    }

    public getColor(colorId: string) {
        if(!this.data) {
            return null;
        }
        
        const visualization = this.getVisualizationData(this.data);

        const colorData = visualization.colors?.find((visualizationColor) => visualizationColor.id === parseInt(colorId));

        return colorData?.layers[0].color ?? null;
    }

    public shouldLoadAssets() {
        if(!this.data) {
            return true;
        }

        const options = this.getOptions();

        if(this.renderer.shouldLoadAssets?.(options)) {
            return true;
        }

        return false;
    }

    public async loadAssets() {
        await FurnitureAssets.fetchFurnitureData(this.type);
        await FurnitureAssets.fetchFurnitureSpritesheet(this.type);

        const options = this.getOptions();

        await this.renderer.loadAssets?.(options);
    }
}
