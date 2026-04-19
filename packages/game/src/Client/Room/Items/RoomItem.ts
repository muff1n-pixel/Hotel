/* eslint-disable @typescript-eslint/no-unused-vars */

import { RoomPositionData } from "@pixel63/events";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomSprite from "./RoomSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import RoomWorkerRenderer from "src/Workers/Room/RoomWorkerRenderer";

export default class RoomItem implements RoomItemInterface {
    public id: number = Math.random();
    
    _position?: RoomPositionData;
    _priority: number = 0;
    
    screenPosition: MousePosition = { left: 0, top: 0 };

    public get priority() {
        return this._priority;
    }

    public set priority(priority: number) {
        this._priority = priority;

        this.calculatedPriority = this.roomRenderer.getItemCalculatedPriority(this);
    }

    disabled: boolean = false;
    alpha: number = 1;

    public calculatedPriority: number = 0;

    public get position() {
        return this._position;
    }

    public set position(position: RoomPositionData | undefined) {
        const dimensions = this.getDimensions();

        const maxDimensionUnit = Math.max(dimensions.row, dimensions.column);

        if(this._position) {
            for(let row = this._position.row; row < this._position.row + maxDimensionUnit; row++) {
                for(let column = this._position.column; column < this._position.column + maxDimensionUnit; column++) {
                    const existingPositionMap = this.roomRenderer.itemPositionMap.get(`${row}x${column}`) ?? [];

                    const existingIndex = existingPositionMap.indexOf(this);

                    if(existingIndex !== -1) {
                        existingPositionMap.splice(existingIndex, 1);

                        this.roomRenderer.itemPositionMap.set(`${row}x${column}`, existingPositionMap);
                    }
                }
            }
        }

        if(position) {
            for(let row = position.row; row < position.row + maxDimensionUnit; row++) {
                for(let column = position.column; column < position.column + maxDimensionUnit; column++) {
                    const existingPositionMap = this.roomRenderer.itemPositionMap.get(`${row}x${column}`) ?? [];

                    existingPositionMap.push(this);

                    // TODO: sort by depth immediately?
                    this.roomRenderer.itemPositionMap.set(`${row}x${column}`, existingPositionMap);
                }
            }
        }

        this.calculatedPriority = this.roomRenderer.getItemCalculatedPriority(this);
        this._position = position;

        this.screenPosition =  this.roomRenderer.getCoordinatePosition(position);
    }

    constructor(public roomRenderer: RoomRenderer | RoomWorkerRenderer, public type: string, public sprites: RoomSprite[] = []) {

    }

    public getDimensions(): RoomPositionData {
        return RoomPositionData.create({
            row: 1,
            column: 1,
            depth: 1
        });
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
