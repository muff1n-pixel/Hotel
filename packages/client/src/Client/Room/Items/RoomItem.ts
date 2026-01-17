import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomSprite from "./RoomSprite";

export default class RoomItem implements RoomItemInterface {
    position?: RoomPosition;
    priority: number = 0;
    disabled: boolean = false;

    constructor(public type: string, public sprites: RoomSprite[] = []) {

    }

    process(frame: number): void {
    }

    public setPosition(position: RoomPosition, index: number = 0) {
        //this.data.position = { row, column, depth };

        this.position = position;
        this.priority = index;
    }

    public positionPathData?: {
        fromPosition: RoomPosition;
        toPosition: RoomPosition;
        relativePosition: RoomPosition;

        startTimestamp: number;
        durationInMilliseconds: number;
    };

    public setPositionPath(fromPosition: RoomPosition, toPosition: RoomPosition) {
        const relativePosition: RoomPosition = {
            row: toPosition.row - fromPosition.row,
            column: toPosition.column - fromPosition.column,
            depth: toPosition.depth - fromPosition.depth
        };

        this.positionPathData = {
            fromPosition,
            toPosition,

            relativePosition,

            startTimestamp: performance.now(),
            durationInMilliseconds: /*Math.max(1, (Math.abs(relativePosition.row) + Math.abs(relativePosition.column) + Math.abs(relativePosition.depth))) */ 500
        };
    }

    public processPositionPath() {
        if(!this.positionPathData) {
            return;
        }

        const elapsedSincedStart = performance.now() - this.positionPathData.startTimestamp;

        if(elapsedSincedStart >= this.positionPathData.durationInMilliseconds) {
            this.finishPositionPath();
            
            return;
        }

        this.setPosition({
            row: this.positionPathData.fromPosition.row + ((this.positionPathData.relativePosition.row / this.positionPathData.durationInMilliseconds) * elapsedSincedStart),
            column: this.positionPathData.fromPosition.column + ((this.positionPathData.relativePosition.column / this.positionPathData.durationInMilliseconds) * elapsedSincedStart),
            depth: this.positionPathData.fromPosition.depth + ((this.positionPathData.relativePosition.depth / this.positionPathData.durationInMilliseconds) * elapsedSincedStart)
        });
    }

    public finishPositionPath() {
        if(!this.positionPathData) {
            return;
        }

        this.setPosition(this.positionPathData.toPosition);

        this.positionPathData = undefined;
    }
}
