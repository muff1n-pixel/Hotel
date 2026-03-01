/* eslint-disable @typescript-eslint/no-unused-vars */

import { RoomPositionData } from "@pixel63/events";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomSprite from "./RoomSprite";
import RoomRenderer from "@Client/Room/Renderer";

export default class RoomItem implements RoomItemInterface {
    position?: RoomPositionData;
    priority: number = 0;

    disabled: boolean = false;
    alpha: number = 1;

    constructor(public roomRenderer: RoomRenderer, public type: string, public sprites: RoomSprite[] = []) {

    }

    process(frame: number): void {
    }

    public setPosition(position: RoomPositionData | undefined, index: number = 0) {
        //this.data.position = { row, column, depth };
        this.position = position;
        this.priority = index;
    }

    public positionPathData?: {
        fromPosition: RoomPositionData;
        toPosition: RoomPositionData | RoomPositionData[];
        relativePosition: RoomPositionData;

        startTimestamp: number;
        durationInMilliseconds: number;
    };

    public setPositionPath(fromPosition: RoomPositionData, toPosition: RoomPositionData | RoomPositionData[], durationInMilliseconds: number = 500) {
        const startPosition = (Array.isArray(toPosition))?(toPosition[0]):(toPosition);

        const relativePosition: RoomPositionData = RoomPositionData.create({
            row: startPosition.row - fromPosition.row,
            column: startPosition.column - fromPosition.column,
            depth: startPosition.depth - fromPosition.depth
        });

        if(Array.isArray(toPosition)) {
            this.positionPathData = {
                fromPosition,
                toPosition,
                relativePosition,

                startTimestamp: performance.now(),
                durationInMilliseconds
            };

            return;
        }

        this.positionPathData = {
            fromPosition,
            toPosition,

            relativePosition,

            startTimestamp: performance.now(),
            durationInMilliseconds
        };
    }

    public processPositionPath() {
        if(!this.positionPathData) {
            return;
        }

        const elapsedSincedStart = performance.now() - this.positionPathData.startTimestamp;

        if(elapsedSincedStart >= this.positionPathData.durationInMilliseconds) {
            if(Array.isArray(this.positionPathData.toPosition)) {
                if(this.positionPathData.toPosition.length <= 1) {
                    this.finishPositionPath();

                    return;
                }

                const fromPosition = this.positionPathData.toPosition[0];

                this.positionPathData.toPosition.splice(0, 1);

                const relativePosition: RoomPositionData = RoomPositionData.create({
                    row: this.positionPathData.toPosition[0].row - fromPosition.row,
                    column: this.positionPathData.toPosition[0].column - fromPosition.column,
                    depth: this.positionPathData.toPosition[0].depth - fromPosition.depth
                });

                this.positionPathData.fromPosition = fromPosition;
                this.positionPathData.relativePosition = relativePosition;
                this.positionPathData.startTimestamp = performance.now();

                return;
            }
            else {
                this.finishPositionPath();
            }
            
            return;
        }

        this.setPosition(RoomPositionData.create({
            row: this.positionPathData.fromPosition.row + ((this.positionPathData.relativePosition.row / this.positionPathData.durationInMilliseconds) * elapsedSincedStart),
            column: this.positionPathData.fromPosition.column + ((this.positionPathData.relativePosition.column / this.positionPathData.durationInMilliseconds) * elapsedSincedStart),
            depth: this.positionPathData.fromPosition.depth + ((this.positionPathData.relativePosition.depth / this.positionPathData.durationInMilliseconds) * elapsedSincedStart)
        }));
    }

    public finishPositionPath() {
        if(!this.positionPathData) {
            return;
        }

        if(Array.isArray(this.positionPathData.toPosition)) {
            this.setPosition(this.positionPathData.toPosition[this.positionPathData.toPosition.length - 1]);
        }
        else {
            this.setPosition(this.positionPathData.toPosition);
        }

        this.positionPathData = undefined;
    }
}
