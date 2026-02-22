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

    private fullSize: number;
    private halfSize: number;

    constructor(public readonly structure: RoomStructure, public floorId: string, private readonly size: number) {
        this.rows = this.structure.grid.length;
        this.columns = Math.max(...this.structure.grid.map((row) => row.length));
        this.depth = 0;

        for(let row = 0; row < this.structure.grid.length; row++) {
            for(let column = 0; column < this.structure.grid[row].length; column++) {
                const depth = this.parseDepth(this.structure.grid[row][column]);

                if(depth === 'X') {
                    continue;
                }

                if(this.depth > depth) {
                    continue;
                }

                this.depth = depth;
            }
        }

        this.fullSize = size / 2;
        this.halfSize = this.fullSize / 2;
    }

    private parseDepth(character: string): number | 'X' {
        if(character === 'X') {
            return character;
        }

        if (character >= '0' && character <= '9') {
            return parseInt(character);
        } else {
            return character.charCodeAt(0) - 55;
        }
    }

    public async renderOffScreen() {
        const data = await RoomAssets.getRoomData("HabboRoomContent");
        const visualization = data.visualization.floorData.floors.find((floor) => floor.id === this.floorId)?.visualizations.find((visualization) => visualization.size === 64);
        
        if(!visualization) {
            throw new Error("Room visualization data does not exist for id " + this.floorId + " and size " + 64);
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

        const width = (this.rows * this.fullSize) + (this.columns * this.fullSize) + (this.structure.wall.thickness * 2);
        const height = (this.rows * this.halfSize) + (this.columns * this.halfSize) + (this.depth * this.fullSize) + ((this.structure.wall.thickness + this.structure.floor.thickness) * 2) + this.halfSize;

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
        context.setTransform(1, .5, 0, 1, this.structure.wall.thickness + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];
            
            if(rectangles.some(x => (Math.floor(x.row) == Math.floor(rectangle.row) + 1 && Math.floor(x.column) == Math.floor(rectangle.column) && x.depth == rectangle.depth))) {
                continue;
            }

            const left = (rectangle.column * this.fullSize) - (rectangle.row * this.fullSize) - rectangle.height;
            const top = (rectangle.row * this.fullSize) - (rectangle.depth * this.fullSize) + rectangle.height;

            const nextStepEdge = rectangles.find(x => (x.column == rectangle.column) && (x.row == rectangle.row + 0.25 || x.row == rectangle.row + 1) && (x.depth === rectangle.depth - 0.25));
            let thickness = this.structure.floor.thickness;

            if(nextStepEdge && (thickness > this.halfSize / 2)) {
                thickness = this.halfSize / 2;
            }

            context.rect(left, top, rectangle.width, thickness);
        }

        context.fill();
    }

    private renderRightEdges(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, -.5, 0, 1, this.structure.wall.thickness + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            if(rectangles.some(x => (Math.floor(x.row) == Math.floor(rectangle.row) && Math.floor(x.column) == Math.floor(rectangle.column) + 1 && x.depth == rectangle.depth))) {
                continue;
            }

            const nextStepEdge = rectangles.find(x => (x.row == rectangle.row) && (x.column == rectangle.column + 0.25 || x.column == rectangle.column + 1) && (x.depth === rectangle.depth - 0.25));

            const row = rectangle.row;

            const column = rectangle.column;

            const left = -(row * this.fullSize) + (column * this.fullSize) + rectangle.width - rectangle.height;
            const top = (column * this.fullSize) - (rectangle.depth * this.fullSize) + rectangle.width;

            let thickness = this.structure.floor.thickness;

            if(nextStepEdge && (thickness > this.halfSize / 2)) {
                thickness = this.halfSize / 2;
            }

            context.rect(left, top, rectangle.height, thickness);
        }

        context.fill();
    }

    private renderTiles(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, -1, .5, this.structure.wall.thickness + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;
                
        const tiles = new Path2D();

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            const left = rectangle.column * this.fullSize - (rectangle.depth * this.fullSize);
            const top = rectangle.row * this.fullSize - (rectangle.depth * this.fullSize);

            const path = new Path2D();

            path.rect(left, top, rectangle.width, rectangle.height);

            this.tiles.push({ row: rectangle.row, column: rectangle.column, depth: Math.round(rectangle.depth), path });
            
            tiles.addPath(path);
        }

        context.fill(tiles);
    }

    private getRectangles() {
        const rectangles: FloorRectangle[] = [];

        for(let row = 0; row < this.structure.grid.length; row++) {
            for(let column = 0; column < this.structure.grid[row].length; column++) {
                const currentDepth = this.parseDepth(this.structure.grid[row][column]);
                
                if(currentDepth === 'X') {
                    continue;
                }

                if(this.parseDepth(this.getTileDepth(row, column - 1)) === currentDepth + 1) {
                    for(let step = 0; step < 4; step++) {
                        rectangles.push({
                            row,
                            column: column + (step * .25),
                            depth: currentDepth + 0.75 - (step * .25),
        
                            width: 8, height: this.fullSize
                        });
                    }

                    continue;
                }

                if(this.parseDepth(this.getTileDepth(row - 1, column)) === currentDepth + 1) {
                    for(let step = 0; step < 4; step++) {
                        rectangles.push({
                            row: row + (step * .25),
                            column,
                            depth: currentDepth + 0.75 - (step * .25),
        
                            width: this.fullSize, height: 8
                        });
                    }

                    continue;
                }

                rectangles.push({
                    row,
                    column,
                    depth: currentDepth,

                    width: this.fullSize,
                    height: this.fullSize
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