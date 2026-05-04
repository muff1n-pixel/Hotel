import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomAssets from "@Client/Assets/RoomAssets";
import { RoomStructureData } from "@pixel63/events";

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

    private leftOutlinePaths: Path2D[] = [];
    private rightOutlinePaths: Path2D[] = [];

    public readonly structure: RoomStructureData;

    constructor(structure: RoomStructureData | undefined, public floorId: string, private readonly size: number, private readonly outline: boolean = false, private readonly hideDoor: boolean = false) {
        if(!structure) {
            throw new Error();
        }

        this.structure = structure;

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

            destinationWidth: (this.fullSize * (spriteData.width / 32)),
            destinationHeight: (this.fullSize * (spriteData.height / 32)),

            color: visualization.color,
            flipHorizontal: assetData.flipHorizontal
        });

        const leftEdgeImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            destinationWidth: (this.fullSize * (spriteData.width / 32)),
            destinationHeight: (this.fullSize * (spriteData.height / 32)),

            color: [visualization.color, "CCC"],
            flipHorizontal: assetData.flipHorizontal
        });

        const rightEdgeImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            destinationWidth: (this.fullSize * (spriteData.width / 32)),
            destinationHeight: Math.min((this.fullSize * (spriteData.height / 32)), (this.fullSize * ((material.width * 2) / 32))),

            color: [visualization.color, "AAA"],
            flipHorizontal: assetData.flipHorizontal
        });

        const width = (this.rows * this.fullSize) + (this.columns * this.fullSize) + ((this.structure.wall?.thickness ?? 8) * 2);
        const height = (this.rows * this.halfSize) + (this.columns * this.halfSize) + (this.depth * this.fullSize) + (((this.structure.wall?.thickness ?? 8) + (this.structure.floor?.thickness ?? 8)) * 2) + this.halfSize;

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        this.leftOutlinePaths = [];
        this.rightOutlinePaths = [];

        context.imageSmoothingEnabled = false;

        const rectangles = this.getRectangles();

        this.tiles = [];

        const doorDepth = this.structure.door
            ? this.parseDepth(this.getTileDepth(this.structure.door.row, this.structure.door.column))
            : 0;
        const groundLevel = doorDepth === 'X' ? 0 : doorDepth;

        const groundRectangles = rectangles.filter((rectangle) => Math.ceil(rectangle.depth) <= groundLevel);
        const elevatedRectangles = rectangles.filter((rectangle) => Math.ceil(rectangle.depth) > groundLevel);

        for(let currentDepth = 0; currentDepth <= groundLevel; currentDepth++) {
            const currentRectangles = groundRectangles.filter((rectangle) => Math.ceil(rectangle.depth) === currentDepth);

            this.renderLeftEdges(context, currentRectangles, leftEdgeImage.image);
            this.renderRightEdges(context, currentRectangles, rightEdgeImage.image);
            this.renderTiles(context, currentRectangles, tileImage.image);
        }

        if(this.outline) {
            context.strokeStyle = "black";
            context.imageSmoothingEnabled = false;

            context.setTransform(1, -.5, 0, 1, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8) + 0.5);
            context.translate(0.5, 0.5);

            for(const outlinePath of this.rightOutlinePaths) {
                context.stroke(outlinePath);
            }
            
            context.setTransform(1, .5, 0, 1, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8) + 0.5);
            context.translate(0.5, 0.5);

            for(const outlinePath of this.leftOutlinePaths) {
                context.stroke(outlinePath);
            }
        }

        this.rightOutlinePaths = [];
        this.leftOutlinePaths = [];

        let elevatedCanvas: OffscreenCanvas | undefined = undefined;

        if(elevatedRectangles.length > 0) {
            elevatedCanvas = new OffscreenCanvas(width, height);

            const elevatedContext = elevatedCanvas.getContext("2d");

            if(!elevatedContext) {
                throw new ContextNotAvailableError();
            }

            for(let currentDepth = groundLevel + 1; currentDepth <= this.depth; currentDepth++) {
                const currentRectangles = elevatedRectangles.filter((rectangle) => Math.ceil(rectangle.depth) === currentDepth);

                this.renderLeftEdges(elevatedContext, currentRectangles, leftEdgeImage.image);
                this.renderRightEdges(elevatedContext, currentRectangles, rightEdgeImage.image);
                this.renderTiles(elevatedContext, currentRectangles, tileImage.image);
            }

            if(this.outline) {
                elevatedContext.strokeStyle = "black";
                elevatedContext.imageSmoothingEnabled = false;

                elevatedContext.setTransform(1, -.5, 0, 1, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize + 0.5, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8) + 0.5);

                for(const outlinePath of this.rightOutlinePaths) {
                    elevatedContext.stroke(outlinePath);
                }

                elevatedContext.setTransform(1, .5, 0, 1, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize + 0.5, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8) + 0.5);

                for(const outlinePath of this.leftOutlinePaths) {
                    elevatedContext.stroke(outlinePath);
                }
            }
        }

        let shadowCanvas: OffscreenCanvas | undefined = undefined;

        if(context.filter !== undefined) {
            shadowCanvas = new OffscreenCanvas(canvas.width, canvas.height + 10);
            
            const shadowContext = shadowCanvas.getContext("2d");

            if(!shadowContext) {
                throw new ContextNotAvailableError();
            }

            shadowContext.filter = "blur(10px) brightness(0%) opacity(50%)";
            shadowContext.drawImage(canvas, 0, 10);

            if(elevatedCanvas) {
                shadowContext.drawImage(elevatedCanvas, 0, 10);
            }
        }

        return {
            floor: canvas,
            elevatedFloor: elevatedCanvas,
            shadow: shadowCanvas
        };
    }

    private renderLeftEdges(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, 0, 1, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8));
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            const left = (rectangle.column * this.fullSize) - (rectangle.row * this.fullSize) - rectangle.height;
            const top = (rectangle.row * this.fullSize) - (rectangle.depth * this.fullSize) + rectangle.height;

            if(this.outline && Math.floor(rectangle.row) === rectangle.row) {
                if(!rectangles.some(x => (Math.floor(x.row) === Math.floor(rectangle.row) - 1 && Math.floor(x.column) === Math.floor(rectangle.column)))) {
                    if(!this.hideDoor || (rectangle.row - 1 !== this.structure.door?.row && rectangle.column !== this.structure.door?.column)) {
                        const outlinePath = new Path2D();

                        outlinePath.moveTo(left + this.fullSize, top - this.fullSize);
                        outlinePath.lineTo(left + this.fullSize + rectangle.width, top - this.fullSize);
                        outlinePath.closePath();

                        this.leftOutlinePaths.push(outlinePath);
                    }
                }
            }
            
            if(rectangles.some(x => (Math.floor(x.row) == Math.floor(rectangle.row) + 1 && Math.floor(x.column) == Math.floor(rectangle.column) && x.depth == rectangle.depth))) {
                continue;
            }

            const nextStepEdge = rectangles.find(x => (x.column == rectangle.column) && (x.row == rectangle.row + 0.25 || x.row == rectangle.row + 1) && (x.depth === rectangle.depth - 0.25));
            let thickness = (this.structure.floor?.thickness ?? 8);

            if(nextStepEdge && (thickness > this.halfSize / 2)) {
                thickness = this.halfSize / 2;
            }

            context.rect(left, top, rectangle.width, thickness);

            if(this.outline) {
                const outlinePath = new Path2D();

                outlinePath.moveTo(left, top);
                outlinePath.lineTo(left + rectangle.width, top);
                outlinePath.closePath();

                this.leftOutlinePaths.push(outlinePath);
            }
        }

        context.fill();
    }

    private renderRightEdges(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, -.5, 0, 1, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8));
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            const row = rectangle.row;
            const column = rectangle.column;

            const left = -(row * this.fullSize) + (column * this.fullSize) + rectangle.width - rectangle.height;
            const top = (column * this.fullSize) - (rectangle.depth * this.fullSize) + rectangle.width;

            if(this.outline && Math.floor(column) === column) {
                if(!rectangles.some(x => (Math.floor(x.row) === Math.floor(rectangle.row) && Math.floor(x.column) === Math.floor(rectangle.column) - 1))) {
                    if(this.hideDoor || (rectangle.row !== this.structure.door?.row && rectangle.column - 1 !== this.structure.door?.column)) {
                        const outlinePath = new Path2D();

                        outlinePath.moveTo(left - this.fullSize, top - this.fullSize);
                        outlinePath.lineTo(left - this.fullSize + rectangle.height, top - this.fullSize);
                        outlinePath.closePath();

                        this.rightOutlinePaths.push(outlinePath);
                    }
                }
            }

            if(rectangles.some(x => (Math.floor(x.row) == Math.floor(rectangle.row) && Math.floor(x.column) == Math.floor(rectangle.column) + 1 && x.depth == rectangle.depth))) {
                continue;
            }

            const nextStepEdge = rectangles.find(x => (x.row == rectangle.row) && (x.column == rectangle.column + 0.25 || x.column == rectangle.column + 1) && (x.depth === rectangle.depth - 0.25));

            let thickness = (this.structure.floor?.thickness ?? 8);

            if(nextStepEdge && (thickness > this.halfSize / 2)) {
                thickness = this.halfSize / 2;
            }

            context.rect(left, top, rectangle.height, thickness);

            if(this.outline) {
                const outlinePath = new Path2D();

                outlinePath.moveTo(left, top);
                outlinePath.lineTo(left + rectangle.height, top);
                outlinePath.closePath();

                this.rightOutlinePaths.push(outlinePath);
            }
        }

        context.fill();
    }

    private renderTiles(context: OffscreenCanvasRenderingContext2D, rectangles: FloorRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, -1, .5, (this.structure.wall?.thickness ?? 8) + this.rows * this.fullSize, ((this.depth + 1) * this.fullSize) + (this.structure.wall?.thickness ?? 8));
        context.fillStyle = context.createPattern(image, "repeat")!;
                
        const tiles = new Path2D();

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            if(this.hideDoor && rectangle.row === this.structure.door?.row && rectangle.column === this.structure.door.column) {
                continue;
            }

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
        
                            width: this.fullSize / 4, height: this.fullSize
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
        
                            width: this.fullSize, height: this.fullSize / 4
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