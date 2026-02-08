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

type WallTile = {
    row: number;
    column: number;
    depth: number;

    direction: number;

    width: number;
    height: number;

    left: number;
    top: number;

    path: Path2D;
};

export default class WallRenderer {
    public leftWalls: WallTile[] = [];
    public rightWalls: WallTile[] = [];

    public rows: number;
    public columns: number;
    public depth: number;

    private fullSize: number;
    private halfSize: number;

    constructor(public readonly structure: RoomStructure, public wallId: string, public readonly size: number) {
        this.rows = this.structure.grid.length;
        this.columns = Math.max(...this.structure.grid.map((row) => row.length));
        this.depth = 0;

        for(let row = 0; row < this.structure.grid.length; row++) {
            for(let column = 0; column < this.structure.grid[row].length; column++) {
                if(this.structure.grid[row][column] === 'X') {
                    continue;
                }

                const depth = this.parseDepth(this.structure.grid[row][column]);

                if(this.depth > depth) {
                    continue;
                }

                this.depth = depth;
            }
        }

        this.fullSize = this.size / 2;
        this.halfSize = this.fullSize / 2;
    }

    private parseDepth(character: string) {
        if (character >= '0' && character <= '9') {
            return parseInt(character);
        } else {
            return character.charCodeAt(0) - 55;
        }
    }

    private async getDoorMask(data: RoomData) {
        const assetData = data.assets.find((asset) => asset.name === `door_64`);

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

            destinationWidth: spriteData.width * (this.size / 64),
            destinationHeight: spriteData.height * (this.size / 64),

            flipHorizontal: assetData.flipHorizontal
        });

        return doorMask;
    }

    public async renderOffScreen(leftWallColor?: string[]) {
        const data = await RoomAssets.getRoomData("HabboRoomContent");
        const visualization = data.visualization.wallData.walls.find((wall) => wall.id === this.wallId)?.visualizations.find((visualization) => visualization.size === 64);
        
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

            color: leftWallColor ?? [visualization.color, "666"],
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
        
        const width = (this.rows * this.fullSize) + (this.columns * this.fullSize) + (this.structure.floor.thickness * 2);
        const height = (this.rows * this.halfSize) + (this.columns * this.halfSize) + (this.depth * this.halfSize) + this.structure.wall.thickness + this.structure.floor.thickness + (this.size * 2);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        this.leftWalls = [];
        this.rightWalls = [];

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

        doorMaskContext.globalCompositeOperation = "destination-in";
        doorMaskContext.drawImage(canvas, 0, 0);

        doorMaskContext.globalCompositeOperation = "source-atop";
        doorMaskContext.drawImage(canvas, 0, 0);

        return {
            wall: canvas,
            doorMask: doorMaskCanvas
        };
    }

    private renderLeftWalls(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, -.5, 0, 1, this.structure.wall.thickness + this.rows * this.fullSize, (this.depth * this.halfSize) + this.structure.wall.thickness);
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            let width = this.fullSize;
            let height = ((3.5 + (this.depth - rectangle.depth)) * this.fullSize);

            let row = rectangle.row;
            let column = rectangle.column;

            let depth = 0;

            if(rectangle.direction == 4) {
                column++;
                
                if(this.getTileDepth(row, column, false) != 'X') {
                    continue;
                }

                width = this.structure.wall.thickness;
                height += this.structure.floor.thickness;
            }
            else if(rectangle.direction == 2) {
                depth = this.parseDepth(this.getTileDepth(row, column + 1, false));
                
                row++;
            }
            else {
                continue;
            }

            const left = -(row * this.fullSize) + (column * this.fullSize);
            const top = (column * this.fullSize) - (this.depth * this.halfSize);

            if(rectangle.direction === 2) {
                const path = new Path2D();
                
                path.rect(left, top, width, height);

                this.leftWalls.push({
                    path,

                    row,
                    column,
                    depth,

                    direction: rectangle.direction,

                    left,
                    top,

                    width,
                    height
                });
            }

            context.rect(left, top, width, height);
        }

        console.log(this.leftWalls);

        context.fill();
        context.closePath();
    }

    private renderRightWalls(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, 0, 1, this.structure.wall.thickness + this.rows * this.fullSize, (this.depth * this.halfSize) + this.structure.wall.thickness);        
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            let row = rectangle.row;
            const column = rectangle.column;  

            let width = this.fullSize;
            let height = ((3.5 + (this.depth - rectangle.depth)) * this.fullSize);

            if(rectangle.direction == 2) {
                row++;
                
                if(this.getTileDepth(row, column, false) != 'X') {
                    continue;
                }

                width = this.structure.wall.thickness;
                height += this.structure.floor.thickness;
            }
            else if(rectangle.direction !== 4) {
                continue;
            }

            const left = (column * this.fullSize) - (row * this.fullSize);
            const top = (row * this.fullSize) - (this.depth * this.halfSize);
            
            if(rectangle.direction === 4) {
                const depth = this.parseDepth(this.getTileDepth(row + 1, column, false));
                
                const path = new Path2D();
                
                path.rect(left - ((width == this.fullSize)?(0):(this.structure.wall.thickness)), top, width, height);

                this.rightWalls.push({
                    path,

                    row,
                    column,
                    depth,

                    direction: rectangle.direction,

                    left,
                    top,

                    width,
                    height
                });
            }

            context.rect(left - ((width == this.fullSize)?(0):(this.structure.wall.thickness)), top, width, height);
        }

        context.fill();
        context.closePath();
    }

    private renderWallTops(context: OffscreenCanvasRenderingContext2D, rectangles: WallRectangle[], image: ImageBitmap) {
        context.beginPath();
        context.setTransform(1, .5, -1, .5, this.structure.wall.thickness + this.rows * this.fullSize, (this.depth * this.halfSize) + this.structure.wall.thickness);     
        context.fillStyle = context.createPattern(image, "repeat")!;

        for(const index in rectangles) {
            const rectangle = rectangles[index];

            const row = rectangle.row;
            const column = rectangle.column;  

            let width = this.fullSize;
            let height = this.fullSize;

            let left = column * this.fullSize - (this.depth * this.halfSize);
            let top = row * this.fullSize - (this.depth * this.halfSize);
           
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

        const extraTile = (overlappingWalls === 1)?(1):(0);

        if(rectangles.some((rectangle) => rectangle.row === this.structure.door!.row && rectangle.column === this.structure.door!.column + 1 && rectangle.direction === 2)) {
            context.setTransform(1, -.5, 0, 1, this.structure.wall.thickness + this.rows * this.fullSize, (this.depth * this.halfSize) + this.structure.wall.thickness);

            const row = this.structure.door.row + extraTile;
            const column = this.structure.door.column;

            const doorDepth = this.parseDepth(this.getTileDepth(this.structure.door.row, this.structure.door.column, false));

            const left = -(row * this.fullSize) + (column * this.fullSize);

            const height = ((3.5 + (this.depth - doorDepth)) * this.fullSize);
            let top = (column * this.fullSize) - (this.depth * this.halfSize) + height - image.height + this.fullSize;

            if(overlappingWalls === 2) {
                top -= image.height;
            }

            context.drawImage(image, left, top, image.width, image.height);
            
            if(overlappingWalls === 1) {
                top -= image.height;
                
                context.drawImage(image, left, top);
            }
        }
        else if(rectangles.some((rectangle) => rectangle.row === this.structure.door!.row + 1 && rectangle.column === this.structure.door!.column && rectangle.direction === 4)) {
            context.setTransform(1, .5, 0, 1, this.structure.wall.thickness + this.rows * this.fullSize, (this.depth * this.halfSize) + this.structure.wall.thickness);

            const row = this.structure.door.row;
            const column = this.structure.door.column + extraTile;

            const doorDepth = this.parseDepth(this.getTileDepth(this.structure.door.row, this.structure.door.column, false));

            const left = (column * this.fullSize) - (row * this.fullSize);

            const height = ((3.5 + (this.depth - doorDepth)) * this.fullSize);
            let top = (row * this.fullSize) - (this.depth * this.halfSize) + height - image.height + this.fullSize;

            if(overlappingWalls === 2) {
                top -= image.height;
            }

            context.drawImage(image, left - image.width, top);

            if(overlappingWalls === 1) {
                top -= image.height;

                context.drawImage(image, left - image.width, top);
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

                rectangles.push({ row, column, depth: this.parseDepth(this.structure.grid[row][column]), direction: 4 });
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

                rectangles.push({ row, column, depth: this.parseDepth(this.getTileDepth(row, column)), direction: 2 });
            }
        }

        // corners
        const rectanglesLeft = rectangles.filter(x => x.direction === 4);

        for(const index in rectanglesLeft) {
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