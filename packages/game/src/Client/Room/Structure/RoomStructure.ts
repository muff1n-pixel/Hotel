import { RoomPositionData, RoomStructureData } from "@pixel63/events";
import RoomRenderer from "../Renderer/RoomRenderer";
import RoomFloorItem from "../Items/Map/RoomFloorItem";
import FloorRenderer from "./FloorRenderer";
import RoomWallItem from "../Items/Map/RoomWallItem";
import WallRenderer from "./WallRenderer";

export default class RoomStructure {
    public data: RoomStructureData;

    public rows: number = 0;
    public columns: number = 0;
    public depth: number = 0;

    public doorDepth: number | 'X' = 'X';
    public groundLevel: number = 0;
    public wallDepth: number = 0;

    constructor(private readonly renderer: RoomRenderer | null, data: RoomStructureData) {
        this.data = data;

        this.setCalculatedData();
    }
        
    public isPositionInsideStructure(position: RoomPositionData, dimensions: RoomPositionData) {
        for(let row = position.row; row < position.row + dimensions.row; row++) {
            for(let column = position.column; column < position.column + dimensions.column; column++) {
                if(this.data.grid[row]?.[column] === undefined || this.data.grid[row]?.[column] === 'X') {
                    return false;
                }
            }   
        }

        return true;
    }

    private setCalculatedData() {
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
            ? this.parseDepth(this.getTileDepth(this.data.door.row, this.data.door.column, false))
            : 0;
        this.groundLevel = this.doorDepth === 'X' ? 0 : this.doorDepth;
    }

    public setStructure(data: RoomStructureData) {
        this.data = data;

        if(!this.renderer) {
            return;
        }

        this.renderer.landscape.recreate();

        if(this.renderer.entityManager.floorItem) {
            this.renderer.entityManager.removeEntity(this.renderer.entityManager.floorItem);

            this.renderer.entityManager.floorItem = undefined;
        }

        const floorPromise = new Promise<void>((resolve) => {
            this.renderer!.entityManager.floorItem = new RoomFloorItem(
                this.renderer!,
                new FloorRenderer(this.renderer!.structure, data.floor?.id ?? "default", 64),
                resolve
            );

            this.renderer!.entityManager.entities.push(this.renderer!.entityManager.floorItem);
        });

        if(this.renderer.entityManager.wallItem) {
            this.renderer.entityManager.removeEntity(this.renderer.entityManager.wallItem);

            this.renderer.entityManager.wallItem = undefined;
        }

        const wallPromise = new Promise<void>((resolve) => {
            if(!data.wall?.hidden) {
                this.renderer!.entityManager.wallItem = new RoomWallItem(
                    this.renderer!,
                    new WallRenderer(this.renderer!.structure, data.wall?.id ?? "default", 64),
                    resolve
                );

                this.renderer!.entityManager.entities.push(this.renderer!.entityManager.wallItem);
            }
            else {
                resolve();
            }
        });

        return Promise.allSettled([
            wallPromise,
            floorPromise,
            this.renderer.landscape.render()
        ]);
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


    public parseStaticDepth(character: string) {
        if (character >= '0' && character <= '9') {
            return parseInt(character);
        } else {
            return character.charCodeAt(0) - 55;
        }
    }

    public getTileDepth(row: number, column: number, excludeDoor: boolean = true): string {
        if(excludeDoor && this.data.door?.row === row && this.data.door?.column === column) {
            return 'X';
        }

        if(this.data.grid[row] && this.data.grid[row][column]) {
            return this.data.grid[row][column];
        }
   
        return 'X';
    }
}