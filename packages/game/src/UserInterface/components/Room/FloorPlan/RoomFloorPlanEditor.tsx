import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import { RoomFloorplanEditData } from "@Shared/Interfaces/Room/Floorplan/RoomFloorplanEditData";
import RoomFloorplanHelper from "@Shared/Helpers/RoomFloorplanHelper";
import { clientInstance } from "../../../..";

export type RoomFloorPlanTool = "add_tile" | "remove_tile" | "raise_tile" | "sink_tile" | "enter_tile" | "tile_picker";

export default class RoomFloorPlanEditor {
    private data?: RoomFloorplanEditData;

    private terminated = false;
    private moving = false;
    private middleButton = false;

    public tool: RoomFloorPlanTool | null = null;
    public activeDepth: number = 0;
    
    private offset: MousePosition = {
        left: 0,
        top: 0
    };

    private canvasOffset: MousePosition = {
        left: 0,
        top: 0
    };

    private tilesPrepended: Omit<RoomPosition, "depth"> = {
        row: 0,
        column: 0
    };

    private mousePosition: MousePosition | null = null;

    constructor(private readonly canvas: HTMLCanvasElement, private updateDepth: (value: number) => void, private update: (data: RoomFloorplanEditData) => void) {
        canvas.addEventListener("mousedown", this.mousedown.bind(this));
        canvas.addEventListener("mousemove", this.mousemove.bind(this));
        canvas.addEventListener("mouseleave", this.mouseleave.bind(this));
        canvas.addEventListener("mouseup", this.mouseup.bind(this));
        canvas.addEventListener("wheel", this.wheel.bind(this));

        this.process();
    }

    private process() {
        if(this.moving && !this.middleButton) {
            const coordinate = this.getMousePosition();

            const anyFurnitureOnTile = coordinate && clientInstance.roomInstance.value?.furnitures.some((furniture) => furniture.isPositionInside(coordinate, { row: 1, column: 1, depth: 1 }));

            if(coordinate && !anyFurnitureOnTile) {
                if(this.tool === "add_tile") {
                    this.updateStructure(coordinate.row, coordinate.column, RoomFloorplanHelper.getDepthCharacter(this.activeDepth));
                }
                else if(this.tool === "remove_tile") {
                    this.updateStructure(coordinate.row, coordinate.column, 'X');
                }
            }
        }

        this.render();

        window.requestAnimationFrame(this.process.bind(this));
    }

    public setStructure(structure: RoomStructure) {
        this.data = {
            structure,
            offsets: {
                row: 0,
                column: 0
            }
        };

        this.update(this.data);
    }

    private wheel(event: WheelEvent) {
        if(event.shiftKey) {
            this.offset.left += 16 * ((event.deltaY < 0)?(1):(-1));
        }
        else {
            this.offset.top += 16 * ((event.deltaY < 0)?(1):(-1));
        }
    }

    private mousedown(event: MouseEvent) {
        this.moving = true;
        this.middleButton = event.button === 1;
    }

    private mouseleave() {
        this.moving = false;
    }

    private mousemove(event: MouseEvent) {
        this.mousePosition = {
            left: event.offsetX,
            top: event.offsetY
        };

        if(!this.moving) {
            return;
        }

        if(this.tool === null || this.middleButton) {
            this.offset.left += event.movementX;
            this.offset.top += event.movementY;
        }
    }

    private mouseup() {
        if(!this.moving) {
            return;
        }

        this.moving = false;

        if(this.middleButton) {
            return;
        }

        if(!this.data) {
            return;
        }

        const coordinate = this.getMousePosition();

        if(!coordinate) {
            return;
        }

        if(this.tool === "tile_picker") {
            const value = this.data?.structure.grid[coordinate.row][coordinate.column];

            if(value === undefined || value === 'X') {
                return;
            }

            const depth = RoomFloorplanHelper.parseDepth(value);

            this.updateDepth(depth);
        }

        if(clientInstance.roomInstance.value) {
            const anyFurnitureOnTile = clientInstance.roomInstance.value.furnitures.some((furniture) => furniture.isPositionInside(coordinate, { row: 1, column: 1, depth: 1 }));

            if(anyFurnitureOnTile) {
                return;
            }
        }

        if(this.tool === "raise_tile") {
            const value = this.data?.structure.grid[coordinate.row][coordinate.column];

            if(value !== undefined && value !== 'X') {
                const depth = RoomFloorplanHelper.parseDepth(value);

                if(depth < 30) {
                    this.updateStructure(coordinate.row, coordinate.column, RoomFloorplanHelper.getDepthCharacter(depth + 1));
                }
            }
        }
        else if(this.tool === "sink_tile") {
            const value = this.data?.structure.grid[coordinate.row][coordinate.column];

            if(value !== undefined && value !== 'X') {
                const depth = RoomFloorplanHelper.parseDepth(value);
                
                if(depth > 0) {
                    this.updateStructure(coordinate.row, coordinate.column, RoomFloorplanHelper.getDepthCharacter(depth - 1));
                }
            }
        }
        else if(this.tool === "enter_tile") {
            const value = this.data?.structure.grid[coordinate.row][coordinate.column];

            if(value === undefined || value === 'X') {
                this.updateStructure(coordinate.row, coordinate.column, '0');
            }

            this.data.structure.door = {
                ...coordinate,
                direction: this.data.structure.door?.direction ?? 2
            };

            this.update(this.data);
        }
    }

    public getMousePosition() {
        if(!this.mousePosition) {
            return null;
        }

        const innerPosition = {
            left: (this.mousePosition.left - this.canvasOffset.left) * 0.5 + (this.mousePosition.top - this.canvasOffset.top),
            top: (this.mousePosition.left - this.canvasOffset.left) * -0.5 + (this.mousePosition.top - this.canvasOffset.top)
        };

        const coordinate: Omit<RoomPosition, "depth"> = {
            row: Math.floor(innerPosition.top / 16),
            column: Math.floor(innerPosition.left / 16)
        };

        return coordinate;
    }

    terminate() {
        this.terminated = true;
     
        this.canvas.removeEventListener("mousedown", this.mousedown.bind(this));
        this.canvas.removeEventListener("mousemove", this.mousemove.bind(this));
        this.canvas.removeEventListener("mouseleave", this.mouseleave.bind(this));
        this.canvas.removeEventListener("mouseup", this.mouseup.bind(this));
        this.canvas.removeEventListener("wheel", this.wheel.bind(this));
    }

    render() {
        if(this.terminated) {
            return;
        }

        this.canvas.width = this.canvas.parentElement!.getBoundingClientRect().width;
        this.canvas.height = this.canvas.parentElement!.getBoundingClientRect().height;

        const context = this.canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.fillStyle = "#000000";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const tileSize = 16;

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        if(this.tilesPrepended.row) {
            this.offset.top -= 8 * Math.abs(this.tilesPrepended.row);
            this.offset.left += 16 * Math.abs(this.tilesPrepended.row);

            this.tilesPrepended.row = 0;
        }

        if(this.tilesPrepended.column) {
            this.offset.top -= 8 * Math.abs(this.tilesPrepended.column);
            this.offset.left -= 16 * Math.abs(this.tilesPrepended.column);

            this.tilesPrepended.column = 0;
        }

        this.canvasOffset = {
            left: (canvasWidth / 2) + this.offset.left,
            top: this.offset.top
        };

        context.setTransform(1, 0.5, -1, 0.5, this.canvasOffset.left, this.canvasOffset.top);

        context.lineWidth = 1;
        context.fillStyle = "#FFF";
        context.font = "6px Arial";

        const tilesX = Math.ceil(canvasWidth / tileSize) * 2;
        const tilesY = Math.ceil(canvasHeight / tileSize) * 2;

        const extraTilesY = (this.data?.structure.grid.length ?? 0) * 2;
        const extraTilesX = (this.data?.structure.grid[0].length ?? 0) * 2;

        for (let row = -tilesY; row < (tilesY + extraTilesY); row++) {
            for (let column = -tilesX; column < (tilesX + extraTilesX); column++) {
                const left = column * tileSize;
                const top = row * tileSize;

                const level = this.data?.structure.grid[row]?.[column];

                if(level === undefined || level === 'X') {
                    context.strokeStyle = "#222";
                    context.strokeRect(left, top, tileSize, tileSize);
                    
                    continue;
                }

                const depth = 1 + RoomFloorplanHelper.parseDepth(level);

                context.fillStyle = "hsl(" + (360 - ((360 / 100) * (34 + (depth * 3)))) + ", 100%, 50%)";
                context.fillRect(left + 1, top + 1, tileSize - 2, tileSize - 2);

                if(clientInstance.roomInstance.value) {
                    const anyFurnitureOnTile = clientInstance.roomInstance.value.furnitures.some((furniture) => furniture.isPositionInside({ row, column }, { row: 1, column: 1, depth: 1 }));

                    if(anyFurnitureOnTile) {
                        context.fillStyle = "rgba(255, 255, 255, .4)";
                        context.fillRect(left + 1, top + 1, tileSize - 2, tileSize - 2);
                    }
                }
            }
        }

        if(this.data?.structure.door) {
            const left = this.data.structure.door.column * tileSize;
            const top = this.data.structure.door.row * tileSize;

            context.lineWidth = 2;
            context.strokeStyle = "#FFFFFF";
            context.strokeRect(left, top, tileSize - 3, tileSize - 3);
        }
    }

    updateStructure(row: number, column: number, value: string) {
        if(!this.data) {
            return null;
        }

        const structure: RoomStructure = JSON.parse(JSON.stringify(this.data.structure));

        const rows = structure.grid.map((columns) => columns.split(''));

        // If row is beneath current grid, prepend new rows
        if(row < 0 && value !== 'X') {
            console.log("Row is beneath current grid");

            this.tilesPrepended.row += Math.abs(row);
            this.data.offsets.row += Math.abs(row);

            rows.unshift(...new Array(Math.abs(row)).fill(null).map(() => new Array(rows[0].length).fill(null).map(() => 'X')));

            if(structure.door) {
                structure.door.row += Math.abs(row);
            }

            row += Math.abs(row);
        }

        // If column is beneath current grid, prepend new columns
        if(column < 0 && value !== 'X') {
            console.log("Column is beneath current grid");
            
            this.tilesPrepended.column += Math.abs(column);
            this.data.offsets.column += Math.abs(column);

            rows.forEach((row) => row.unshift(...new Array(Math.abs(column)).fill(null).map(() => 'X')));

            if(structure.door) {
                structure.door.column += Math.abs(column);
            }

            column += Math.abs(column);
        }

        // If row exceeds current grid, append new rows
        if(row >= rows.length && value !== 'X') {
            console.log("Row exceeds current grid");

            const newRows = row - rows.length + 1;

            rows.push(
                ...new Array(newRows).fill(null).map(() => new Array(rows[0].length).fill(null).map(() => 'X'))
            );
        }

        // If column exceeds current grid, append new columns
        if(column >= rows[0].length && value !== 'X') {
            console.log("Column exceeds current grid");

            rows.forEach((currentRow) => {
                currentRow.push(
                    ...new Array(column - currentRow.length + 1).fill(null).map(() => 'X')
                );
            });
        }

        if(row >= 0 && row < rows.length && column >= 0 && column < rows[0].length) {
            console.log("Row and column is within current grid", { value });

            rows[row][column] = value;
        }

        this.data.structure = {
            ...structure,
            grid: rows.map((row) => row.join(''))
        };

        this.update(this.data);
    }
}
