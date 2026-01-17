import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomAssets from "@Client/Assets/RoomAssets";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";

type FloorRectangle = {
    row: number;
    column: number;
    depth: number;

    width: number;
    height: number;
};

type FloorTile = {
    row: number;
    column: number;
    depth: number;

    path: Path2D;
};

export default class FloorRenderer {
    public tiles: FloorTile[] = [];

    public rows: number;
    public columns: number;
    public depth: number;

    constructor(public readonly structure: RoomStructure, private readonly floorId: string, private readonly size: number) {
        this.rows = this.structure.grid.length;
        this.columns = Math.max(...this.structure.grid.map((row) => row.length));
        this.depth = 0;

        for(let row in this.structure.grid) {
            for(let column of this.structure.grid[row]) {
                if(column === 'X') {
                    continue;
                }

                if(this.depth > parseInt(column)) {
                    continue;
                }

                this.depth = parseInt(column);
            }
        }
    }

    public async renderOffScreen() {
        const data = await RoomAssets.getRoomData("HabboRoomContent");
        const visualization = data.visualization.floorData.floors.find((floor) => floor.id === this.floorId)?.visualizations.find((visualization) => visualization.size === this.size);
        
        if(!visualization) {
            throw new Error("Room visualization data does not exist for id and size.");
        }

        const material = data.visualization.floorData.materials.find((material) => material.id === visualization.materialId);
        
        if(!material) {
            throw new Error("Room material data does not exist.");
        }

        const texture = data.visualization.floorData.textures.find((texture) => texture.id === material?.textureId);

        if(!texture) {
            throw new Error("Room texture data does not exist.");
        }

        const assetData = data.assets.find((asset) => asset.name === texture.assetName);

        if(!assetData) {
            throw new Error("Room asset data does not exist.");
        }

        const spriteData = data.sprites.find((sprite) => sprite.name === (assetData.source ?? assetData.name));

        if(!spriteData) {
            throw new Error("Sprite data does not exist for room texture.");
        }

        const tileImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            color: visualization.color,
            flipHorizontal: assetData.flipHorizontal
        });

        const leftEdgeImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            color: [visualization.color, "BBB"],
            flipHorizontal: assetData.flipHorizontal
        });

        const rightEdgeImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            destinationHeight: Math.min(spriteData.height, material.width * 2),

            color: [visualization.color, "666"],
            flipHorizontal: assetData.flipHorizontal
        });

        const width = (this.rows * 32) + (this.columns * 32) + (this.structure.wall.thickness * 2);
        const height = (this.rows * 16) + (this.columns * 16) + (this.depth * 16) + ((this.structure.wall.thickness + this.structure.floor.thickness) * 2);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const rectangles = this.getRectangles();

        this.tiles = [];

        for(let currentDepth = 0; currentDepth <= this.depth; currentDepth++) {
            const currentRectangles = rectangles.filter((rectangle) => Math.ceil(rectangle.depth) === currentDepth);

            this.renderLeftEdges(context, currentRectangles, leftEdgeImage.image);
            this.renderRightEdges(context, currentRectangles, rightEdgeImage.image);
            this.renderTiles(context, currentRectangles, tileImage.image);
        }

        return canvas;
    }

    private renderLeftEdges(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, 0, 1, this.structure.wall.thickness + this.rows * 32, ((this.depth + 1) * 16) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (x.row == rectangle.row + 1 && x.column == rectangle.column && x.depth == rectangle.depth)) != null)
                continue;

            const left = (rectangle.column * 32) - (rectangle.row * 32) - rectangle.height;
            const top = (rectangle.row * 32) - (rectangle.depth * 32) + rectangle.height;

            context.rect(left, top, rectangle.width, this.structure.floor.thickness);
        }

        context.fill();
    }

    private renderRightEdges(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, -.5, 0, 1, this.structure.wall.thickness + this.rows * 32, ((this.depth + 1) * 16) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.find(x => (x.row == rectangle.row && x.column == rectangle.column + 1 && x.depth == rectangle.depth)) != null)
                continue;

            const row = rectangle.row;

            const column = rectangle.column;

            const left = -(row * 32) + (column * 32) + rectangle.width - rectangle.height;
            const top = (column * 32) - (rectangle.depth * 32) + rectangle.width;

            context.rect(left, top, rectangle.height, this.structure.floor.thickness);
        }

        context.fill();
    }

    private renderTiles(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, -1, .5, this.structure.wall.thickness + this.rows * 32, ((this.depth + 1) * 16) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;
                
        const tiles = new Path2D();

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            const left = rectangle.column * 32 - (rectangle.depth * 32);
            const top = rectangle.row * 32 - (rectangle.depth * 32);

            const path = new Path2D();

            path.rect(left, top, rectangle.width, rectangle.height);

            this.tiles.push({ row: rectangle.row, column: rectangle.column, depth: rectangle.depth, path });
            
            tiles.addPath(path);
        }

        context.fill(tiles);
    }

    private getRectangles() {
        const rectangles: FloorRectangle[] = [];

        for(let row = 0; row < this.structure.grid.length; row++) {
            for(let column = 0; column < this.structure.grid[row].length; column++) {
                if(this.structure.grid[row][column] === 'X') {
                    continue;
                }

                if(parseInt(this.getTileDepth(row, column - 1)) === parseInt(this.getTileDepth(row, column)) + 1) {
                    for(let step = 0; step < 4; step++) {
                        rectangles.push({
                            row,
                            column: column + (step * .25),
                            depth: parseInt(this.getTileDepth(row, column)) + 0.75 - (step * .25),
        
                            width: 8, height: 32
                        });
                    }

                    continue;
                }

                if(parseInt(this.getTileDepth(row - 1, column)) === parseInt(this.getTileDepth(row, column)) + 1) {
                    for(let step = 0; step < 4; step++) {
                        rectangles.push({
                            row: row + (step * .25),
                            column,
                            depth: parseInt(this.getTileDepth(row, column)) + 0.75 - (step * .25),
        
                            width: 32, height: 8
                        });
                    }

                    continue;
                }

                rectangles.push({
                    row,
                    column,
                    depth: parseInt(this.structure.grid[row][column]),

                    width: 32,
                    height: 32
                });
            }
        }

        return rectangles;
    }

    private getTileDepth(row: number, column: number): string {
        if(this.structure.grid[row] && this.structure.grid[row][column]) {
            return this.structure.grid[row][column];
        }
   
        return 'X';
    }
}