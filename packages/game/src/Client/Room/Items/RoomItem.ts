/* eslint-disable @typescript-eslint/no-unused-vars */

import { RoomPositionData } from "@pixel63/events";
import RoomItemInterface from "../Interfaces/RoomItemInterface";
import RoomSprite from "./RoomSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import { Container } from "pixi.js";

export default class RoomItem implements RoomItemInterface {
    public id: number = Math.random();
    
    screenPosition: MousePosition = { left: 0, top: 0 };

    private _priority: number = 0;
    public get priority() {
        return this._priority;
    }
    public set priority(priority: number) {
        this._priority = priority;

        this.updateSprites();
    }

    private _sprites: RoomSprite[] = [];

    public get sprites() {
        return this._sprites;
    }

    private _disabled: boolean = false;
    public get disabled() {
        return this._disabled;
    }

    private _alpha: number = 1;
    public get alpha() {
        return this._alpha;
    }
    public set alpha(alpha: number) {
        this._alpha = alpha;
        
        this.updateSprites();
    }

    public calculatedPriority: number = 0;

    private _position?: RoomPositionData;
    public get position() {
        return this._position;
    }

    constructor(public roomRenderer: RoomRenderer, public type: string, sprites: RoomSprite[] = []) {
        this._sprites = sprites;
    }

    public setSprites(sprites: RoomSprite[]) {
        for(const sprite of this._sprites) {
            if(sprites.includes(sprite)) {
                sprite.update();
                
                continue;
            }
            
            sprite.destroy();
        }

        this._sprites = sprites;
    }

    public updateSprites() {
        for(const sprite of this._sprites) {
            sprite.update();
        }
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
        
        this._position = position;
        this._priority = index;
        
        this.calculatedPriority = this.roomRenderer.getItemCalculatedPriority(this);
        this.screenPosition =  this.roomRenderer.getCoordinatePosition(position);

        this.updateSprites();
    }

    public set disabled(disabled: boolean) {
        this._disabled = disabled;

        for(const sprite of this.sprites) {
            sprite.sprite.visible = !disabled;
        }
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
        }), 10);
    }

    public finishPositionPath() {
        if(!this.positionPathData) {
            return;
        }

        let position: RoomPositionData;

        if(Array.isArray(this.positionPathData.toPosition)) {
            position = this.positionPathData.toPosition[this.positionPathData.toPosition.length - 1];
        }
        else {
            position = this.positionPathData.toPosition;
        }

        this.positionPathData = undefined;
        this.setPosition(position);
    }

    public destroy() {
        for(const sprite of this.sprites) {
            sprite.destroy();
        }
    }
}
