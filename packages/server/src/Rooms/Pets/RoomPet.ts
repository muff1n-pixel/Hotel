import Room from "../Room.js";
import { game } from "../../index.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import { RoomActorActionData, RoomActorChatData, RoomActorPositionData, RoomActorWalkToData, RoomPetsData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import { UserPetModel } from "../../Database/Models/Users/Pets/UserPetModel.js";

export default class RoomPet implements RoomActor {
    public preoccupiedByActionHandler: boolean = false;

    public actions: string[] = [];
    public position: RoomPositionData;
    public direction: number;

    public path: RoomActorPath;

    public lastActivity: number = 0;

    constructor(public readonly room: Room, public readonly model: UserPetModel) {
        this.position = model.position;
        this.direction = model.direction;

        this.path = new RoomActorPath(this);
    }

    public static async place(room: Room, userPet: UserPetModel, position: RoomPositionData, direction: number) {
        await userPet.update({
            position,
            direction,
            roomId: room.model.id
        });

        const roomPet = new RoomPet(room, userPet);

        room.pets.push(roomPet);

        room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position));

        room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
            petsAdded: [
                roomPet.model
            ]
        }));

        return roomPet;
    }

    public hasAction(actionId: string): boolean {
        return this.actions.includes(actionId);
    }

    public addAction(action: string) {
        if(this.actions.includes(action)) {
            return;
        }

        this.actions.push(action);

        this.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            
            actionsAdded: [action]
        }));
    }

    public removeAction(action: string) {
        const actionId = action.split('.')[0]!;

        const existingActionIndex = this.actions.findIndex((action) => action.split('.')[0] === actionId);

        if(existingActionIndex === -1) {
            return;
        }

        this.actions.splice(existingActionIndex, 1);

        this.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            
            actionsRemoved: [actionId]
        }));
    }
    
    public sendWalkEvent(previousPosition: RoomPositionData): void {
        this.room.sendProtobuff(RoomActorWalkToData, RoomActorWalkToData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            from: previousPosition,
            to: this.position,
            direction: this.direction
        }));
    }

    public sendPositionEvent(usePath: boolean) {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            
            position: this.position,
            direction: this.direction,
            usePath
        }));
    }

    public async pickup() {
        this.room.pets.splice(this.room.pets.indexOf(this), 1);

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(this.model.position));

        this.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
            petsRemoved: [
                this.model
            ]
        }));

        await this.model.update({
            roomId: null
        });

        const user = game.getUserById(this.model.user.id);

        if(user) {
            user.getInventory().addPet(this.model).catch(console.error);
        }
    }

    public async setPosition(position: RoomPositionData, save: boolean = true) {
        const previousPosition = this.model.position;

        this.position = position;

        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(previousPosition));
        this.room.floorplan.updatePosition(RoomPositionOffsetData.fromJSON(position));

        if(save && this.model.changed()) {
            await this.model.save();

            this.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
                petsUpdated: [
                    this.model
                ]
            }));
        }
    }

    public async handleActionsInterval() {
        //if(this.model.relaxed) {
            await this.handleRelaxed();
        //}

        this.path.handleActionsInterval().catch(console.error);
    }

    private lastMovement: number = 0;

    public async handleRelaxed() {
        const elapsedSinceLastMovement = performance.now() - this.lastMovement;

        if(elapsedSinceLastMovement < 3 * 1000) {
            return;
        }

        if(this.path.path) {
            return;
        }

        this.lastMovement = performance.now();

        const targetPosition = RoomPositionOffsetData.create({
            row: this.model.position.row + Math.floor(Math.random() * 7) - 3,
            column: this.model.position.column + Math.floor(Math.random() * 7) - 3,
        });

        if(this.room.model.structure.door?.row === targetPosition.row && this.room.model.structure.door?.column === targetPosition.column) {
            return;
        }

        this.path.walkTo(targetPosition);
    }
}
