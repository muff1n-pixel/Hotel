import { RoomStructureData } from "@pixel63/events";

export default class RoomStructure {
    public rows: number;
    public columns: number;
    public depth: number;

    public doorDepth: number | 'X';
    public groundLevel: number;
    public wallDepth: number;

    constructor(public readonly data: RoomStructureData) {
        this.rows = this.data.grid.length;
        this.columns = Math.max(...this.data.grid.map((row) => row.length));
        this.depth = 0;

        for(let row = 0; row < this.data.grid.length; row++) {
            for(let column = 0; column < this.data.grid[row].length; column++) {
                const depth = this.parseDepth(this.data.grid[row][column]);

                if(depth === 'X') {
                    continue;
                }

                if(this.depth > depth) {
                    continue;
                }

                this.depth = depth;
            }
        }

        this.wallDepth = this.depth;
        
        if(this.data.wall?.height) {
            this.depth += this.data.wall.height;
        }

        this.doorDepth = this.data.door
            ? this.parseDepth(this.getTileDepth(this.data.door.row, this.data.door.column))
            : 0;
        this.groundLevel = this.doorDepth === 'X' ? 0 : this.doorDepth;
    }
    
    public parseDepth(character: string): number | 'X' {
        if(character === 'X') {
            return character;
        }

        if (character >= '0' && character <= '9') {
            return parseInt(character);
        } else {
            return character.charCodeAt(0) - 55;
        }
    }

    public getTileDepth(row: number, column: number): string {
        if(this.data.grid[row] && this.data.grid[row][column]) {
            return this.data.grid[row][column];
        }
   
        return 'X';
    }
}