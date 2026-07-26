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

    timestamp: number;
    image: ImageBitmap;
};

export default class LandscapeRenderer {
    private fullSize: number;
    private halfSize: number;
    
    public wallThickness: number;
    public floorThickness: number;

    private rectangles: WallRectangle[];
    private leftRectangles: WallRectangle[];
    private rightRectangles: WallRectangle[];

    private animationLayers: LandscapeAnimationLayer[] = [];

    private canvas: OffscreenCanvas;
    private textureCanvas: OffscreenCanvas;

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

        this.leftRectangles = this.rectangles.filter((rectangle) => rectangle.direction === 2);
        this.rightRectangles = this.rectangles.filter((rectangle) => rectangle.direction === 4);
    
        const width = (this.structure.rows * this.fullSize) + (this.structure.columns * this.fullSize) + (this.floorThickness * 2);
        const height = (this.structure.rows * this.halfSize) + (this.structure.columns * this.halfSize) + (this.structure.wallDepth * this.fullSize) + (this.wallThickness) + this.floorThickness + (this.size * 2);

        this.canvas = new OffscreenCanvas(width, height);
        
        const textureWidth = this.rectangles.length * this.fullSize;
        const textureHeight = (this.structure.wallDepth * this.fullSize) + (this.size * 2);

        this.textureCanvas = new OffscreenCanvas(textureWidth, textureHeight);
    }

    public async renderOffScreen() {
        const context = this.canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.imageSmoothingEnabled = false;

        const texture = await this.renderTexture();

        context.drawImage(texture, 0, 0);

        context.textAlign = "center";

        context.setTransform(1, -.5, 0, 1, (this.wallThickness) + this.structure.rows * this.fullSize, (this.structure.wallDepth * this.halfSize) + (this.wallThickness));

        for(const rectangle of this.leftRectangles) {
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
        
        for(const rectangle of this.rightRectangles) {
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

        context.resetTransform();

        return this.canvas.transferToImageBitmap();
    }

    private visualization?: RoomData["visualization"]["landscapeData"]["landscapes"][0]["visualizations"][0];

    private async renderTexture() {
        const context = this.textureCanvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const data = await RoomAssets.getRoomData("HabboRoomContent");

        if(!this.visualization) {
            this.visualization = this.getLandscapeData(data);
        }

        if(this.visualization.color) {
            context.fillStyle = this.visualization.color;
            context.fillRect(0, 0, this.textureCanvas.width, this.textureCanvas.height);
        }

        for(const visualizationLayer of this.visualization.visualizationLayers) {
            const material = await this.getVisualizationLayer(data, visualizationLayer);

            if(material) {
                context.drawImage(material, 0, 0);
            }
        }

        if(this.visualization.animationLayers.length && !this.animationLayers.length) {
            this.animationLayers = await Promise.all(this.visualization.animationLayers.map(async (animationLayer) => {
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

                return {
                    ...animationLayer,

                    speedX: animationLayer.speedX ?? 0,

                    left: Math.random() * 100,
                    top: Math.random() * (animationLayer.randomY ?? 100),

                    timestamp: performance.now(),

                    image
                };
            }));
        }

        const now = performance.now();

        for(const animationLayer of this.animationLayers) {
            animationLayer.left += ((now - animationLayer.timestamp) / 500) * animationLayer.speedX;
            animationLayer.timestamp = now;

            animationLayer.left %= 100;

            const left = Math.round((animationLayer.left / 100) * this.textureCanvas.width);
            const top = Math.round((animationLayer.top / 100) * this.textureCanvas.height);

            context.drawImage(animationLayer.image, left, top);

            if(left > (this.textureCanvas.width - animationLayer.image.width)) {
                const overlappingWidth = (left + animationLayer.image.width) - this.textureCanvas.width;

                context.drawImage(animationLayer.image, -animationLayer.image.width + overlappingWidth, top);
            }
        }

        return this.textureCanvas;
    }

    private getLandscapeData(data: RoomData) {
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

    private visualizationLayers: Map<string, OffscreenCanvas> = new Map();

    private async getVisualizationLayer(data: RoomData, visualizationLayer: RoomData["visualization"]["landscapeData"]["landscapes"][0]["visualizations"][0]["visualizationLayers"][0]) {
        if(this.visualizationLayers.has(visualizationLayer.materialId)) {
            return this.visualizationLayers.get(visualizationLayer.materialId);
        }

        const material = this.getMaterial(data, visualizationLayer.materialId);

        const width = this.rectangles.length * this.fullSize;
        const height = (this.structure.wallDepth * this.fullSize) + (this.size * 2);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        for(const matrix of material.cellMatrixes) {
            for(const column of matrix.cellColumns) {
                for(const cell of column.cells) {
                    if(cell.extraItemData?.types.length) {
                        for(let left = 0; left < width; left += column.width) {
                            const usedOffsetIds: number[] = [];

                            for(let index = 0; index < (cell.extraItemData.limitMax ?? cell.extraItemData.offsets.length); index++) {
                                /*const offset = cell.extraItemData.offsets[Math.floor(Math.random() * cell.extraItemData.offsets.length)];

                                if(!offset) {
                                    continue;
                                }

                                if(usedOffsetIds.includes(offset.id)) {
                                    continue;
                                }

                                usedOffsetIds.push(offset.id);*/

                                const type = cell.extraItemData.types[Math.floor(Math.random() * cell.extraItemData.types.length)];

                                if(!type) {
                                    continue;
                                }

                                const typeParts = type.assetName.split('_');
                                const typePart = typeParts[typeParts.length - 1];

                                const textureData = data.visualization.landscapeData.textures.find((texture) => texture.id === cell.textureId);

                                if(!textureData) {
                                    continue;
                                }

                                const textureAsset = textureData.assets.find((asset) => asset.assetName.endsWith(typePart));

                                if(!textureAsset) {
                                    continue;
                                }

                                const texture = await this.getTexture(data, textureAsset.assetName);

                                if(matrix.align === "bottom") {
                                    context.translate(0, height - texture.height);
                                }

                                context.drawImage(texture,
                                    0, 0, texture.width, texture.height,
                                    left, 0, texture.width, texture.height);

                                context.resetTransform();
                            }
                        }
                    }
                    else {
                        const textureData = data.visualization.landscapeData.textures.find((texture) => texture.id === cell.textureId);

                        if(!textureData) {
                            continue;
                        }

                        const textureAsset = textureData.assets[0];

                        if(!textureAsset) {
                            continue;
                        }

                        const texture = await this.getTexture(data, textureAsset.assetName);

                        if(!texture) {
                            continue;
                        }

                        if(matrix.align === "bottom") {
                            context.translate(0, height - texture.height);
                        }

                        for(let left = 0; left < width; left += column.width) {
                            context.drawImage(texture,
                                0, 0, texture.width, texture.height,
                                left, 0, column.width, texture.height);
                        }
                    }
                }
            }
        }

        this.visualizationLayers.set(visualizationLayer.materialId, canvas);

        return canvas;
    }

    private async getTexture(data: RoomData, assetName: string) {
        const assetData = data.assets.find((asset) => asset.name === assetName);
        
        if(!assetData) {
            throw new Error("Room asset data " + assetName + " does not exist.");
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

        return image;
    }
}
