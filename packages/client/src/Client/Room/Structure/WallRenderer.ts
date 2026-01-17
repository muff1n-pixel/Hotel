import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomAssets from "@Client/Assets/RoomAssets";
import { RoomData } from "@Client/Interfaces/Room/RoomData";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";

type WallRectangle = {
    row: number;
    column: number;
    depth: number;

    direction: number;
};

type FloorTile = {
    row: number;
    column: number;
    depth: number;

    path: Path2D;
};

export default class WallRenderer {
    public tiles: FloorTile[] = [];

    public rows: number;
    public columns: number;
    public depth: number;

    constructor(public readonly structure: RoomStructure, private readonly wallId: string, public readonly size: number) {
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

    private async getDoorMask(data: RoomData) {
        const assetData = data.assets.find((asset) => asset.name === `door_${this.size}`);

        if(!assetData) {
            throw new Error("Room asset data does not exist.");
        }

        const spriteData = data.sprites.find((sprite) => sprite.name === (assetData.source ?? assetData.name));

        if(!spriteData) {
            throw new Error("Sprite data does not exist for room texture.");
        }

        const doorMask = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            flipHorizontal: assetData.flipHorizontal
        });

        return doorMask;
    }

    public async renderOffScreen() {
        const data = await RoomAssets.getRoomData("HabboRoomContent");
        const visualization = data.visualization.wallData.walls.find((wall) => wall.id === this.wallId)?.visualizations.find((visualization) => visualization.size === this.size);
        
        if(!visualization) {
            throw new Error("Room visualization data does not exist for id and size.");
        }

        const material = data.visualization.wallData.materials.find((material) => material.id === visualization.materialId);
        
        if(!material) {
            throw new Error("Room material data does not exist.");
        }

        const texture = data.visualization.wallData.textures.find((texture) => texture.id === material?.textureId);

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

        const rightWallImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            color: visualization.color,
            flipHorizontal: assetData.flipHorizontal
        });

        const leftWallImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            color: [visualization.color, "666"],
            flipHorizontal: assetData.flipHorizontal
        });

        const topWallImage = await RoomAssets.getRoomSprite("HabboRoomContent", {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,

            destinationHeight: Math.min(spriteData.height, material.width * 2),

            color: [visualization.color, "BBB"],
            flipHorizontal: assetData.flipHorizontal
        });

        const doorMask = await this.getDoorMask(data);
        
        const width = (this.rows * 32) + (this.columns * 32) + (this.structure.floor.thickness * 2);
        const height = (this.rows * 16) + (this.columns * 16) + (this.depth * 16) + this.structure.floor.thickness + 10;

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        const rectangles = this.getRectangles();

        for(let currentDepth = 0; currentDepth <= this.depth; currentDepth++) {
            const currentRectangles = rectangles.filter((rectangle) => Math.ceil(rectangle.depth) === currentDepth);

            this.renderLeftWalls(context, currentRectangles, leftWallImage.image);
            this.renderRightWalls(context, currentRectangles, rightWallImage.image);
            this.renderWallTops(context, rectangles, topWallImage.image);

            context.globalCompositeOperation = "destination-out";

            this.renderDoorMask(context, rectangles, doorMask.image);

            context.globalCompositeOperation = "source-over";
        }

        const doorMaskCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        const doorMaskContext = doorMaskCanvas.getContext("2d");

        if(!doorMaskContext) {
            throw new ContextNotAvailableError();
        }

        this.renderDoorMask(doorMaskContext, rectangles, doorMask.image, 1);
        this.renderDoorMask(doorMaskContext, rectangles, doorMask.image, 2);

        doorMaskContext.resetTransform();

        doorMaskContext.globalCompositeOperation = "source-atop";
        doorMaskContext.drawImage(canvas, 0, 0);

        return {
            wall: canvas,
            doorMask: doorMaskCanvas
        };
    }

    private renderLeftWalls(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, -.5, 0, 1, this.structure.wall.thickness + this.rows * 32, (this.depth * 16) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let width = 32;
            let height = ((3.5 + (this.depth - rectangle.depth)) * 32);

            let row = rectangle.row;
            let column = rectangle.column;

            if(rectangle.direction == 4) {
                column++;
                
                if(this.getTileDepth(row, column, false) != 'X') {
                    continue;
                }

                width = this.structure.wall.thickness;
                height += this.structure.floor.thickness;
            }
            else if(rectangle.direction == 2) {
                row++;
            }
            else {
                continue;
            }

            const left = -(row * 32) + (column * 32);
            const top = (column * 32) - (this.depth * 16);
            
            context.rect(left, top, width, height);
        }

        context.fill();
        context.closePath();
    }

    private renderRightWalls(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, 0, 1, this.structure.wall.thickness + this.rows * 32, (this.depth * 16) + this.structure.wall.thickness);        
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let row = rectangle.row;
            let column = rectangle.column;  

            let width = 32;
            let height = ((3.5 + (this.depth - rectangle.depth)) * 32);

            if(rectangle.direction == 4) {

            }
            else if(rectangle.direction == 2) {
                row++;
                
                if(this.getTileDepth(row, column, false) != 'X') {
                    continue;
                }

                width = this.structure.wall.thickness;
                height += this.structure.floor.thickness;
            }
            else
                continue;

            let left = (column * 32) - (row * 32);
            let top = (row * 32) - (this.depth * 16);
            
            context.rect(left - ((width == 32)?(0):(this.structure.wall.thickness)), top, width, height);
        }

        context.fill();
        context.closePath();
    }

    private renderWallTops(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, -1, .5, this.structure.wall.thickness + this.rows * 32, (this.depth * 16) + this.structure.wall.thickness);     
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(let index in rectangles) {
            const rectangle = rectangles[index];

            let row = rectangle.row;
            let column = rectangle.column;  

            let width = 32;
            let height = 32;

            let left = column * 32 - (this.depth * 16);
            let top = row * 32 - (this.depth * 16);
           
            if(rectangle.direction == 1) {
                width = this.structure.wall.thickness;
                height = this.structure.wall.thickness;

                left -= this.structure.wall.thickness;
                top -= this.structure.wall.thickness;
            }
            else if(rectangle.direction == 2) {
                width = this.structure.wall.thickness;

                left -= this.structure.wall.thickness;
            }
            else if(rectangle.direction == 4) {
                height = this.structure.wall.thickness;

                top -= this.structure.wall.thickness;
            }
            else {
                continue;
            }

            context.rect(left, top, width, height);
        }

        context.fill();
        context.closePath();
    }

    private renderDoorMask(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap, overlappingWalls: number = 0) {
        if(!this.structure.door) {
            return;
        }

        let extraTile = (overlappingWalls === 1)?(1):(0);

        if(rectangles.some((rectangle) => rectangle.row === this.structure.door!.row && rectangle.column === this.structure.door!.column + 1 && rectangle.direction === 2)) {
            context.setTransform(1, -.5, 0, 1, this.structure.wall.thickness + this.rows * 32, (this.depth * 16) + this.structure.wall.thickness);

            const row = this.structure.door.row + extraTile;
            const column = this.structure.door.column;

            const left = -(row * 32) + (column * 32);
            let top = (column * 32) - (this.depth * 16);

            const doorDepth = parseInt(this.getTileDepth(this.structure.door.row, this.structure.door.column, false));

            if(overlappingWalls === 2) {
                top -= image.height;
            }

            context.drawImage(image, left, top + (doorDepth * 32) - this.structure.floor.thickness);
            
            if(overlappingWalls === 1) {
                top -= image.height;
                
                context.drawImage(image, left, top + (doorDepth * 32) - this.structure.floor.thickness);
            }
        }
        else if(rectangles.some((rectangle) => rectangle.row === this.structure.door!.row + 1 && rectangle.column === this.structure.door!.column && rectangle.direction === 4)) {
            context.setTransform(1, .5, 0, 1, this.structure.wall.thickness + this.rows * 32, (this.depth * 16) + this.structure.wall.thickness);

            const row = this.structure.door.row;
            const column = this.structure.door.column + extraTile;

            const left = (column * 32) - (row * 32);
            let top = (row * 32) - (this.depth * 16);

            const doorDepth = parseInt(this.getTileDepth(this.structure.door.row, this.structure.door.column, false));

            if(overlappingWalls === 2) {
                top -= image.height;
            }

            context.drawImage(image, left - image.width, top + (doorDepth * 32) - this.structure.floor.thickness);

            if(overlappingWalls === 1) {
                top -= image.height;

                context.drawImage(image, left - image.width, top + (doorDepth * 32) - this.structure.floor.thickness);
            }
        }
    }

    private getRectangles() {
        const rectangles: WallRectangle[] = [];

        // right walls
        for(let row = 0; row < this.structure.grid.length; row++) {
            for(let column = 0; column < this.structure.grid[row].length; column++) {
                if(this.structure.grid[row][column] === 'X') {
                    continue;
                }

                if(this.structure.door?.row === row && this.structure.door?.column === column) {
                    continue;
                }

                let hasPrevious = false;

                for(let previousRow = row - 1; previousRow >= 0; previousRow--) {
                    if(this.getTileDepth(previousRow, column) === 'X') {
                        for(let previousColumn = column - 1; previousColumn >= 0; previousColumn--) {
                            if(this.getTileDepth(previousRow, previousColumn) == 'X')
                                continue;
        
                            hasPrevious = true;
        
                            break;
                        }

                        if(hasPrevious)
                            break;

                        continue;
                    }

                    hasPrevious = true;

                    break;
                }

                if(hasPrevious) {
                    continue;
                }

                rectangles.push({ row, column, depth: parseInt(this.structure.grid[row][column]), direction: 4 });
            }
        }

        // left walls
        for(let row = 0; row < this.structure.grid.length; row++) {
            for(let column = 0; column < this.structure.grid[row].length; column++) {
                if(this.structure.grid[row][column] === 'X') {
                    continue;
                }

                if(this.structure.door?.row === row && this.structure.door?.column === column) {
                    continue;
                }

                let hasPrevious = false;

                for(let previousColumn = column - 1; previousColumn >= 0; previousColumn--) {
                    if(this.getTileDepth(row, previousColumn) !== 'X') {
                        hasPrevious = true;

                        break;
                    }

                    for(let previousRow = row - 1; previousRow >= 0; previousRow--) {
                        if(this.getTileDepth(previousRow, previousColumn) !== 'X') {
                            hasPrevious = true;
    
                            break;
                        }
                    }
                }

                if(hasPrevious) {
                    continue;
                }

                rectangles.push({ row, column, depth: parseInt(this.getTileDepth(row, column)), direction: 2 });
            }
        }

        // corners
        const rectanglesLeft = rectangles.filter(x => x.direction === 4);

        for(let index in rectanglesLeft) {
            const rectangle = rectanglesLeft[index];

            if(rectangles.find(x => (x.direction == 2 && x.row == rectangle.row && x.column == rectangle.column)) === null) {
                continue;
            }

            if(!rectangles.some(x => (x.direction == 2 && x.row == rectangle.row + 1 && x.column == rectangle.column))) {
                continue;
            }

            rectangles.push({ row: rectangle.row, column: rectangle.column, depth: rectangle.depth, direction: 1 });
        }

        return rectangles;
    }

    private getTileDepth(row: number, column: number, excludeDoor: boolean = true): string {
        if(excludeDoor && this.structure.door?.row === row && this.structure.door?.column === column) {
            return 'X';
        }

        if(this.structure.grid[row] && this.structure.grid[row][column]) {
            return this.structure.grid[row][column];
        }
   
        return 'X';
    }
}