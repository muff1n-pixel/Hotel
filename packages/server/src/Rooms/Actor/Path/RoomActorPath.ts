import RoomActor from "../RoomActor";
import RoomUser from "../../Users/RoomUser";
import RoomBot from "../../Bots/RoomBot";
import { RoomActorActionData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import RoomPet from "../../Pets/RoomPet";

export default class RoomActorPath {
    public frozen: boolean = false;
    public frozenAt: number = 0;

    private previousPosition: RoomPositionData | undefined;

    public path?: RoomPositionOffsetData[] | undefined;
    public walkThroughFurniture?: boolean | undefined;
    public pathOnFinish: (() => void) | undefined;
    public pathOnCancel: (() => void) | undefined;
    public pathJump: boolean = false;

    constructor(private readonly actor: RoomActor) {

    }

    public async handleActionsInterval() {
        if(this.previousPosition) {
            if(this.previousPosition.row !== this.actor.position.row && this.previousPosition.column !== this.actor.position.column) {
                await this.actor.handleWalkEvent?.(RoomPositionOffsetData.fromJSON(this.previousPosition), RoomPositionOffsetData.fromJSON(this.actor.position)).catch(console.error);
            }

            this.previousPosition = undefined;
        }

        if(this.path === undefined) {
            return;
        }

        if(this.frozen) {
            await this.finishPath();

            return;
        }

        const nextPosition = this.path[0];

        if(!nextPosition) {
            await this.finishPath();

            return;
        }

        // TODO: use room floor plan

        if(!this.isNextPositionFree(nextPosition, this.path)) {
            this.path = undefined;
            this.pathOnCancel?.();

            return;
        }

        const furniture = this.actor.room.getUpmostFurnitureAtPosition(nextPosition);

        const depth = this.actor.room.getUpmostDepthAtPosition(nextPosition, furniture);

        if(depth === null) {
            this.path = undefined;
            this.pathOnCancel?.();

            return;
        }

        const previousPosition = {...this.actor.position};

        if(this.actor.hasAction("Sit")) {
            const furnitureAtPreviousPosition = this.actor.room.getUpmostFurnitureAtPosition(RoomPositionOffsetData.fromJSON(previousPosition));

            if(furnitureAtPreviousPosition?.model.furniture.flags.sitable) {
                previousPosition.depth = furnitureAtPreviousPosition.model.position.depth + 0.01;
            }
        }

        const position = RoomPositionData.create({
            row: nextPosition.row,
            column: nextPosition.column,
            depth: depth + 0.01
        });

        this.actor.removeAction("Sit");

        this.actor.position = position;
        this.path.splice(0, 1);
        
        const relativePosition: RoomPositionData = RoomPositionData.create({
            row: position.row - previousPosition.row,
            column: position.column - previousPosition.column,
            depth: position.depth - previousPosition.depth
        });

        this.actor.direction = this.getDirectionFromRelativePosition(relativePosition);

        this.previousPosition = previousPosition;

        this.actor.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(previousPosition));
        this.actor.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position));

        this.actor.lastActivity = performance.now();

        await this.actor.handleBeforeWalkEvent?.(RoomPositionOffsetData.fromJSON(previousPosition), RoomPositionOffsetData.fromJSON(position));
        
        this.actor.sendWalkEvent(previousPosition, this.pathJump);
    }

    private isNextPositionFree(nextPosition: RoomPositionOffsetData, path: RoomPositionOffsetData[]) {
        const blockingActor = this.actor.room.getActorAtPosition(nextPosition);

        if(blockingActor) {
            const blockedByAnotherUser = (blockingActor instanceof RoomUser && (!(this.actor instanceof RoomUser) || blockingActor.user.model.id !== this.actor.user.model.id));
            const blockedByAnotherBot = (blockingActor instanceof RoomBot && (!(this.actor instanceof RoomBot) || blockingActor.model.id !== this.actor.model.id));
            const blockedByAnotherPet = (blockingActor instanceof RoomPet && (!(this.actor instanceof RoomPet) || blockingActor.model.id !== this.actor.model.id));

            if(blockedByAnotherBot || blockedByAnotherUser || blockedByAnotherPet) {
                console.log("User path cancelled, user is obstructing");

                return false;
            }
        }

        const furniture = this.actor.room.getUpmostFurnitureAtPosition(nextPosition);

        if(furniture) {
            if(!this.walkThroughFurniture && !furniture.isWalkable(path.length === 1)) {
                console.log("User path cancelled");

                return false;
            }
        }

        return true;
    }
    
    public walkTo(position: RoomPositionOffsetData, walkThroughFurniture: boolean = false, onFinish: ((() => void) | undefined) = undefined, onCancel: ((() => void) | undefined) = undefined, jump = false) {
        if(!this.actor.room.model.structure.grid[position.row]?.[position.column]) {
            return false;
        }

        const astarFinder = this.actor.room.floorplan.getAstarFinder(this.actor, position, walkThroughFurniture);

        const result = astarFinder.findPath({
            x: this.actor.position.row,
            y: this.actor.position.column,
        }, {
            x: position.row,
            y: position.column,
        });

        const path = result.map((position) => {
            return RoomPositionOffsetData.create({
                row: position[0]!,
                column: position[1]!
            })
        });

        path.splice(0, 1);

        if(!path.length) {
            onCancel?.();

            return false;
        }

        this.walkThroughFurniture = walkThroughFurniture;

        if(!this.isNextPositionFree(path[0]!, path)) {
            onCancel?.();

            return false;
        }

        this.path = path;
        this.pathOnFinish = onFinish;
        this.pathOnCancel = onCancel;
        this.pathJump = jump;

        this.actor.room.requestActionsFrame();

        return true;
    }

    public teleportTo(position: RoomPositionOffsetData, usePath: boolean = true, walkEvent: boolean = true) {
        if(this.actor.room.model.structure.grid[position.row]?.[position.column] === undefined || this.actor.room.model.structure.grid[position.row]?.[position.column] === 'X') {
            return;
        }

        const sitableFurniture = this.actor.room.getSitableFurnitureAtPosition(position);
        const furniture = this.actor.room.getUpmostFurnitureAtPosition(position);

        if(sitableFurniture) {
            const roomActorActionsData = this.actor.addAction("Sit", undefined, false);

            this.actor.path.setPosition(RoomPositionData.create({
                ...position,
                depth: sitableFurniture.model.position.depth + sitableFurniture.model.furniture.dimensions.depth - 0.5
            }), sitableFurniture.model.direction ?? undefined, usePath, walkEvent, roomActorActionsData);
        }
        else if(furniture) {
            if(!furniture.isWalkable(true)) {
                return;
            }
            
            const depth = this.actor.room.getUpmostDepthAtPosition(position, furniture);

            if(depth !== null) {
                this.actor.removeAction("Sit");

                this.setPosition(RoomPositionData.create({
                    row: position.row,
                    column: position.column,
                    depth
                }), undefined, usePath, walkEvent);
            }
        }
        else {
            const depth = this.actor.room.getUpmostDepthAtPosition(position);

            if(depth !== null) {
                this.actor.removeAction("Sit");

                this.setPosition(RoomPositionData.create({
                    row: position.row,
                    column: position.column,
                    depth
                }), undefined, usePath, walkEvent);
            }
        }
    }

    public setPosition(position: RoomPositionData, direction?: number, usePath?: boolean, walkEvent: boolean = true, roomActorActionsData: RoomActorActionData | null = null) {
        if(position.row === this.actor.position.row && position.column === this.actor.position.column && position.depth === this.actor.position.depth && (direction !== undefined && direction === this.actor.direction)) {
            return;
        }

        const previousPosition = this.actor.position;

        this.actor.position = position;

        this.actor.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(previousPosition));
        this.actor.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position));

        if(direction !== undefined) {
            this.actor.direction = direction;
        }

        this.path = undefined;
        this.pathOnCancel?.();

        this.actor.lastActivity = performance.now();

        this.actor.sendPositionEvent(usePath === true, roomActorActionsData);

        if(walkEvent) {
            this.actor.handleWalkEvent?.(RoomPositionOffsetData.fromJSON(previousPosition), RoomPositionOffsetData.fromJSON(position)).catch(console.error);
        }
    }

    public setDirection(direction: number) {
        if(direction === this.actor.direction) {
            return;
        }

        this.actor.direction = direction;

        this.actor.sendDirectionEvent();
    }

    public async finishPath() {
        if(this.path === undefined) {
            return;
        }

        console.log("path finished")

        const sitableFurniture = this.actor.room.getSitableFurnitureAtPosition(RoomPositionOffsetData.fromJSON(this.actor.position));

        if(sitableFurniture) {
            const roomActorActionsData = this.actor.addAction("Sit", undefined, false);

            this.actor.path.setPosition({
                ...this.actor.position,
                depth: sitableFurniture.model.position.depth + sitableFurniture.model.furniture.dimensions.depth - 0.5
            }, sitableFurniture.model.direction ?? undefined, undefined, undefined, roomActorActionsData);
        }

        this.path = undefined;
        this.pathOnFinish?.();
    }

    public getDirectionFromRelativePosition(relativePosition: RoomPositionData): number {
        if(relativePosition.row > 0) {
            relativePosition.row = 1;
        }

        if(relativePosition.row < 0) {
            relativePosition.row = -1;
        }

        if(relativePosition.column > 0) {
            relativePosition.column = 1;
        }

        if(relativePosition.column < 0) {
            relativePosition.column = -1;
        }

        switch(`${relativePosition.row}x${relativePosition.column}`) {
            case "-1x0":
                return 0;

            case "-1x1":
                return 1;

            case "0x1":
                return 2;

            case "1x1":
                return 3;

            case "1x0":
                return 4;

            case "1x-1":
                return 5;

            case "0x-1":
                return 6;

            case "-1x-1":
                return 7;
        }

        return 0;
    }

    public getRelativePositionFromDirection(): RoomPositionOffsetData {
        switch(this.actor.direction) {
            case 1: {
                return RoomPositionOffsetData.create({
                    row: -1,
                    column: -1
                });
            }

            case 2: {
                return RoomPositionOffsetData.create({
                    row: -1,
                    column: 0
                });
            }

            case 3: {
                return RoomPositionOffsetData.create({
                    row: -1,
                    column: 1
                });
            }

            case 4: {
                return RoomPositionOffsetData.create({
                    row: 0,
                    column: 1
                });
            }

            case 5: {
                return RoomPositionOffsetData.create({
                    row: 1,
                    column: 1
                });
            }

            case 6: {
                return RoomPositionOffsetData.create({
                    row: 1,
                    column: 0
                });
            }

            case 7: {
                return RoomPositionOffsetData.create({
                    row: 1,
                    column: -1
                });
            }
        }

        return RoomPositionOffsetData.create({
            row: 0,
            column: 0
        });
    }

    public setFrozen(frozen: boolean) {
        if(this.frozen === frozen) {
            return;
        }

        this.frozen = frozen;

        if(frozen) {
            this.frozenAt = performance.now();
        }
    }
}
