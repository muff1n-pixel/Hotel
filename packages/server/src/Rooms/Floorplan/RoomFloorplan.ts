import { AStarFinder } from "astar-typescript";
import Room from "../Room";
import RoomUser from "../Users/RoomUser";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition";
import RoomFurniture from "../Furniture/RoomFurniture";

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

    private getMutableGrid() {
        return [...this.grid];
    }

    public updatePosition(position: Omit<RoomPosition, "depth">, previousPosition?: Omit<RoomPosition, "depth">) {
        if(this.grid[position.row]?.[position.column] === undefined) {
            throw new Error("Position does not exist in structure.");
        }

        this.grid[position.row]![position.column] = this.getPositionWeight(position);

        if(previousPosition && (previousPosition.row !== position.row || previousPosition.column !== position.column)) {
            this.updatePosition(previousPosition);
        }
    }

    private getPositionWeight(position: Omit<RoomPosition, "depth">, walkThroughFurniture: boolean = false) {
        if(this.room.model.structure.grid[position.row]?.[position.column] === undefined || this.room.model.structure.grid[position.row]?.[position.column] === 'X') {
            return 0;
        }

        if(!walkThroughFurniture) {
            const upmostFurniture = this.room.getUpmostFurnitureAtPosition(position);
            
            if(upmostFurniture) {
                if(!upmostFurniture.isWalkable()) {
                    return 1;
                }
            }
        }

        const user = this.room.getRoomUserAtPosition(position);

        if(user) {
            return 1;
        }

        return 0;
    }

    public getAstarFinder(roomUser: RoomUser, targetPosition: Omit<RoomPosition, "depth">, walkThroughFurniture: boolean = false) {
        const grid = this.getMutableGrid();

        if(walkThroughFurniture) {
            for(let row = 0; row < this.room.model.structure.grid.length; row++) {
                for(let column = 0; column < this.room.model.structure.grid[row]!.length; column++) {
                    grid[row]![column] = this.getPositionWeight({ row, column }, true);
                }
            }
        }

        grid[roomUser.position.row]![roomUser.position.column] = 0;

        const usersAtTargetPosition = this.room.users.filter((user) => user.position.row === targetPosition.row && user.position.column === targetPosition.column);

        for(const userAtTargetPosition of usersAtTargetPosition) {
            //grid[targetPosition.row]![targetPosition.column] = 0;
        }

        const columns = grid[0]!.map((_, colIndex) => grid.map(row => row[colIndex]!));

        return new AStarFinder({
            grid: {
                matrix: columns
            }
        });
    }
}
