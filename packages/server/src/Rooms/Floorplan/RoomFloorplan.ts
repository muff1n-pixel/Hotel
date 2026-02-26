import { AStarFinder } from "astar-typescript";
import Room from "../Room";
import RoomUser from "../Users/RoomUser";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition";
import RoomFurniture from "../Furniture/RoomFurniture";
import RoomActor from "../Actor/RoomActor";

export default class RoomFloorplan {
    private grid: number[][];

    constructor(private readonly room: Room) {
        this.grid = this.generateStaticGrid();
    }

    private generateStaticGrid() {
        return this.room.model.structure.grid.map((row, rowIndex) => {
            return row.split('').map((column, columnIndex) => {
                return this.getPositionWeight({ row: rowIndex, column: columnIndex });
            });
        });
    }

    public regenerateStaticGrid() {
        this.grid = this.generateStaticGrid();
    }

    private getMutableGrid() {
        return [...this.grid];
    }

    public updatePosition(position: Omit<RoomPosition, "depth">, dimensions: Omit<RoomPosition, "depth"> = { row: 1, column: 1 }) {
        for(let row = position.row; row < position.row + dimensions.row; row++) {
            for(let column = position.column; column < position.column + dimensions.column; column++) {
                if(this.grid[row]?.[column] === undefined) {
                    console.warn("Position does not exist in structure.");

                    return;
                }

                this.grid[row]![column] = this.getPositionWeight({
                    row,
                    column
                });
            }
        }
    }

    private getPositionWeight(position: Omit<RoomPosition, "depth">, walkThroughFurniture: boolean = false, finalDestination: boolean = false) {
        if(this.room.model.structure.grid[position.row]?.[position.column] === undefined || this.room.model.structure.grid[position.row]?.[position.column] === 'X') {
            return 1;
        }

        if(!walkThroughFurniture) {
            const upmostFurniture = this.room.getUpmostFurnitureAtPosition(position);
            
            if(upmostFurniture) {
                if(!upmostFurniture.isWalkable(finalDestination)) {
                    return 1;
                }
            }
        }

        const user = this.room.getRoomUserAtPosition(position);

        if(user) {
            return 1;
        }

        const bot = this.room.getBotAtPosition(position);

        if(bot) {
            return 1;
        }

        return 0;
    }

    public getAstarFinder(actor: RoomActor, targetPosition: Omit<RoomPosition, "depth">, walkThroughFurniture: boolean = false) {
        const grid = this.getMutableGrid();

        if(walkThroughFurniture) {
            for(let row = 0; row < this.room.model.structure.grid.length; row++) {
                for(let column = 0; column < this.room.model.structure.grid[row]!.length; column++) {
                    grid[row]![column] = this.getPositionWeight({ row, column }, true);
                }
            }
        }

        grid[actor.position.row]![actor.position.column] = 0;
        
        if(grid[targetPosition.row] && grid[targetPosition.row]?.[targetPosition.column]) {
            grid[targetPosition.row]![targetPosition.column] = this.getPositionWeight(targetPosition, walkThroughFurniture, true);
        }

        const columns = grid[0]!.map((_, colIndex) => grid.map(row => row[colIndex]!));

        return new AStarFinder({
            grid: {
                matrix: columns
            }
        });
    }
}
