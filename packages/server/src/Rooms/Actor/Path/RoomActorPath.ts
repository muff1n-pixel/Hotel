import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition";
import RoomActor from "../RoomActor";
import RoomUser from "../../Users/RoomUser";
import RoomBot from "../../Bots/RoomBot";

export default class RoomActorPath {
    public path?: Omit<RoomPosition, "depth">[] | undefined;
    public walkThroughFurniture?: boolean | undefined;
    public pathOnFinish: (() => void) | undefined;
    public pathOnCancel: (() => void) | undefined;

    constructor(private readonly actor: RoomActor) {

    }

    public async handleActionsInterval() {
        if(this.path === undefined) {
            return;
        }

        const nextPosition = this.path[0];

        if(!nextPosition) {
            await this.finishPath();

            return;
        }

        // TODO: use room floor plan

        const blockingActor = this.actor.room.getActorAtPosition(nextPosition);

        if(blockingActor) {
            const blockedByAnotherUser = (blockingActor instanceof RoomUser && this.actor instanceof RoomUser && blockingActor.user.model.id !== this.actor.user.model.id);
            const blockedByAnotherBot = (blockingActor instanceof RoomBot && this.actor instanceof RoomBot && blockingActor.model.id !== this.actor.model.id);

            if(blockedByAnotherBot || blockedByAnotherUser) {
                console.log("User path cancelled, user is obstructing");

                this.path = undefined;
                this.pathOnCancel?.();
    
                return;
            }
        }

        const furniture = this.actor.room.getUpmostFurnitureAtPosition(nextPosition);

        if(furniture) {
            if(!this.walkThroughFurniture && !furniture.isWalkable(this.path.length === 1)) {
                console.log("User path cancelled");

                this.path = undefined;
                this.pathOnCancel?.();

                return;
            }
        }

        const depth = this.actor.room.getUpmostDepthAtPosition(nextPosition, furniture);

        const previousPosition = {...this.actor.position};

        if(this.actor.hasAction("Sit")) {
            const furnitureAtPreviousPosition = this.actor.room.getUpmostFurnitureAtPosition(previousPosition);

            if(furnitureAtPreviousPosition?.model.furniture.flags.sitable) {
                previousPosition.depth = furnitureAtPreviousPosition.model.position.depth + 0.01;
            }
        }

        const position = {
            row: nextPosition.row,
            column: nextPosition.column,
            depth: depth + 0.01
        };

        this.actor.removeAction("Sit");

        this.actor.position = position;
        this.path!.splice(0, 1);

        this.actor.sendWalkEvent(previousPosition);

        this.actor.room.floorplan.updatePosition(previousPosition);
        this.actor.room.floorplan.updatePosition(position);

        this.actor.handleWalkEvent?.(previousPosition, position);

        this.actor.lastActivity = performance.now();
    }
    
    public walkTo(position: Omit<RoomPosition, "depth">, walkThroughFurniture: boolean = false, onFinish: ((() => void) | undefined) = undefined, onCancel: ((() => void) | undefined) = undefined) {
        if(!this.actor.room.model.structure.grid[position.row]?.[position.column]) {
            return;
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
            return {
                row: position[0]!,
                column: position[1]!
            }
        });

        path.splice(0, 1);

        this.path = path;
        this.walkThroughFurniture = walkThroughFurniture;
        this.pathOnFinish = onFinish;
        this.pathOnCancel = onCancel;

        console.log("Result: " + JSON.stringify(path));

        this.actor.room.requestActionsFrame();
    }

    public teleportTo(position: Omit<RoomPosition, "depth">) {
        if(this.actor.room.model.structure.grid[position.row]?.[position.column] === undefined || this.actor.room.model.structure.grid[position.row]?.[position.column] === 'X') {
            return;
        }

        const sitableFurniture = this.actor.room.getSitableFurnitureAtPosition(position);
        const furniture = this.actor.room.getUpmostFurnitureAtPosition(position);

        if(sitableFurniture) {
            this.actor.addAction("Sit");
            this.actor.path.setPosition({
                ...position,
                depth: sitableFurniture.model.position.depth + sitableFurniture.model.furniture.dimensions.depth - 0.5
            }, sitableFurniture.model.direction, true);            
        }
        else if(furniture) {
            const depth = this.actor.room.getUpmostDepthAtPosition(position, furniture);

            this.setPosition({
                row: position.row,
                column: position.column,
                depth
            }, undefined, true);
        }
        else {
            const depth = this.actor.room.getUpmostDepthAtPosition(position);

            this.setPosition({
                row: position.row,
                column: position.column,
                depth
            }, undefined, true);
        }
    }

    public setPosition(position: RoomPosition, direction?: number, usePath?: boolean) {
        if(position.row === this.actor.position.row && position.column === this.actor.position.column && position.depth === this.actor.position.depth) {
            return;
        }

        const previousPosition = this.actor.position;

        this.actor.position = position;

        this.actor.room.floorplan.updatePosition(previousPosition);
        this.actor.room.floorplan.updatePosition(position);

        if(direction !== undefined) {
            this.actor.direction = direction;
        }

        this.path = undefined;
        this.pathOnCancel?.();

        this.actor.lastActivity = performance.now();

        this.actor.sendPositionEvent(usePath === true);

        this.actor.handleWalkEvent?.(previousPosition, position);
    }

    public async finishPath() {
        if(this.path === undefined) {
            return;
        }

        const sitableFurniture = this.actor.room.getSitableFurnitureAtPosition(this.actor.position);

        if(sitableFurniture) {
            this.actor.addAction("Sit");
            this.actor.path.setPosition({
                ...this.actor.position,
                depth: sitableFurniture.model.position.depth + sitableFurniture.model.furniture.dimensions.depth - 0.5
            }, sitableFurniture.model.direction);
        }


        console.log("User path finished");

        this.path = undefined;
        this.pathOnFinish?.();
    }
}