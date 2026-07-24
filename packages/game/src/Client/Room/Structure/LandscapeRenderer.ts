import RoomAssets from "@Client/Assets/RoomAssets";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { RoomData } from "@Client/Interfaces/Room/RoomData";
import RoomStructure from "@Client/Room/Structure/RoomStructure";
import WallRenderer, { WallRectangle } from "@Client/Room/Structure/WallRenderer";
import { clientInstance } from "@Game/index";

export type LandscapeAnimationLayer = {
    id: number;
    
    assetId: string;

    speedX: number;

    left: number;
    top: number;
};

export default class LandscapeRenderer {
    private fullSize: number;
    private halfSize: number;
    
    public wallThickness: number;
    public floorThickness: number;

    private rectangles: WallRectangle[];

    private animationLayers: LandscapeAnimationLayer[] = [];

    constructor(public readonly structure: RoomStructure, public readonly size: number) {
        this.fullSize = this.size / 2;
        this.halfSize = this.fullSize / 2;

        this.wallThickness = ((this.structure.data.wall?.thickness ?? 8) / 32) * this.fullSize;
        this.floorThickness = ((this.structure.data.floor?.thickness ?? 8) / 32) * this.fullSize;

        this.rectangles = WallRenderer.getRectangles(this.structure).filter((rectangle) => rectangle.direction !== 1).sort((a, b) => {
            const aRow = (a.direction === 2)?(a.row + 1):(a.row);
            const bRow = (b.direction === 2)?(b.row + 1):(b.row);

            return ((bRow - b.column) - (aRow - a.column));
        });
    }

    public async renderOffScreen() {
        const width = (this.structure.rows * this.fullSize) + (this.structure.columns * this.fullSize) + (this.floorThickness * 2);
        const height = (this.structure.rows * this.halfSize) + (this.structure.columns * this.halfSize) + (this.structure.wallDepth * this.fullSize) + (this.wallThickness) + this.floorThickness + (this.size * 2);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.imageSmoothingEnabled = false;

        const texture = await this.renderTexture();

        const leftRectangles = this.rectangles.filter((rectangle) => rectangle.direction === 2);
        const rightRectangles = this.rectangles.filter((rectangle) => rectangle.direction === 4);

        context.drawImage(texture, 0, 0);

        context.textAlign = "center";

        context.setTransform(1, -.5, 0, 1, (this.wallThickness) + this.structure.rows * this.fullSize, (this.structure.wallDepth * this.halfSize) + (this.wallThickness));

        for(const rectangle of leftRectangles) {
            const width = this.fullSize;
            const height = Math.ceil((3.5 + (this.structure.wallDepth - rectangle.depth)) * this.fullSize) + 1;

            const row = rectangle.row + 1;
            const column = rectangle.column;

            const left = -(row * this.fullSize) + (column * this.fullSize);
            const top = (column * this.fullSize) - (this.structure.wallDepth * this.halfSize);

            context.drawImage(
                texture,
                (this.rectangles.indexOf(rectangle) * this.fullSize), 0, this.fullSize, (this.structure.wallDepth * this.fullSize) + (this.size * 2),
                left, top, width, height
            );

            if(clientInstance.settings.value.debugRoomLandscapes) {
                context.fillText(`${row}x${column}`, left + this.halfSize, top + 78);
                context.fillText(`${this.rectangles.indexOf(rectangle)}`, left + this.halfSize, top + 78 + 12);
            }
        }
        
        context.setTransform(1, .5, 0, 1, (this.wallThickness) + this.structure.rows * this.fullSize, (this.structure.wallDepth * this.halfSize) + (this.wallThickness));        
        
        for(const rectangle of rightRectangles) {
            const row = rectangle.row;
            const column = rectangle.column;  

            const width = this.fullSize;
            const height = Math.ceil((3.5 + (this.structure.wallDepth - rectangle.depth)) * this.fullSize) + 1;

            const left = (column * this.fullSize) - (row * this.fullSize);
            const top = (row * this.fullSize) - (this.structure.wallDepth * this.halfSize);

            context.drawImage(
                texture,
                (this.rectangles.indexOf(rectangle) * this.fullSize), 0, this.fullSize, (this.structure.wallDepth * this.fullSize) + (this.size * 2),
                left, top, width, height
            );

            if(clientInstance.settings.value.debugRoomLandscapes) {
                context.fillText(`${row}x${column}`, left + this.halfSize, top + 78);
                context.fillText(`${this.rectangles.indexOf(rectangle)}`, left + this.halfSize, top + 78 + 12);
            }
        }

        return canvas;
    }

    private async renderTexture() {
        const width = this.rectangles.length * this.fullSize;
        const height = (this.structure.wallDepth * this.fullSize) + (this.size * 2);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.imageSmoothingEnabled = false;

        const data = await RoomAssets.getRoomData("HabboRoomContent");

        const visualization = await this.getLandscapeData(data);

        if(visualization.color) {
            context.fillStyle = visualization.color;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        for(const visualizationLayer of visualization.visualizationLayers) {
            const material = this.getMaterial(data, visualizationLayer.materialId);

            for(const matrix of material.cellMatrixes) {
                for(const column of matrix.cellColumns) {
                    for(const cell of column.cells) {
                        //
                    }
                }
            }
        }

        if(visualization.animationLayers.length && !this.animationLayers.length) {
            this.animationLayers = visualization.animationLayers.map((animationLayer) => {
                return {
                    ...animationLayer,

                    speedX: animationLayer.speedX ?? 0,

                    left: (Math.random() * ((animationLayer.randomX ?? 100) / 100)) * this.rectangles.length,
                    top: (Math.random() * ((animationLayer.randomY ?? 100) / 100)) * height
                };
            });
        }

        for(const animationLayer of this.animationLayers) {
            animationLayer.left += animationLayer.speedX / 10;

            if(animationLayer.left > this.rectangles.length) {
                animationLayer.left = -1;
            }

            const assetData = data.assets.find((asset) => asset.name === animationLayer.assetId);
    
            if(!assetData) {
                throw new Error("Room asset data does not exist.");
            }
    
            const spriteData = data.sprites.find((sprite) => sprite.name === (assetData.source ?? assetData.name));
    
            if(!spriteData) {
                throw new Error("Sprite data does not exist for room texture.");
            }
    
            const { image } = await RoomAssets.getRoomSprite("HabboRoomContent", {
                x: spriteData.x,
                y: spriteData.y,
    
                width: spriteData.width,
                height: spriteData.height,

                ignoreImageData: true
            });

            context.drawImage(image, Math.round(animationLayer.left * this.fullSize), Math.round(animationLayer.top));
        }

        return canvas;
    }

    private async getLandscapeData(data: RoomData) {
        const landscape = data.visualization.landscapeData.landscapes.find((landscape) => landscape.id === (this.structure.data.landscape?.id ?? "default"));
        const visualization = landscape?.visualizations.find(((visualization) => visualization.size === 64));
        
        if(!visualization) {
            throw new Error("Room visualization data does not exist for id and size.");
        }

        return visualization;
    }

    private getMaterial(data: RoomData, materialId: string) {
        const material = data.visualization.landscapeData.materials.find((material) => material.id === materialId);

        if(!material) {
            throw new Error("Material does not exist.");
        }

        return material;
    }
}
