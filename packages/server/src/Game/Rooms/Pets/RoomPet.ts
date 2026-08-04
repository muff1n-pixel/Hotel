import Room from "../Room.js";
import { game } from "../../index.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import { RoomActorActionData, RoomActorChatData, RoomActorIdentifierData, RoomActorPositionData, RoomActorWalkToData, RoomPetsData, RoomPositionData, RoomPositionOffsetData } from "@pixel63/events";
import { UserPetModel } from "../../Database/Models/Users/Pets/UserPetModel.js";
import RoomActorPose from "../Actor/Poses/RoomActorPose.js";
import RoomPetPose from "../Actor/Poses/RoomPetPose.js";

export enum RoomPetState {
    FREE = "free",
    SIT = "sit"
};

export default class RoomPet implements RoomActor {
    public preoccupiedByActionHandler: boolean = false;

    public get position(): RoomPositionData {
        return this.model.position;
    };

    public set position(value: RoomPositionData) {
        this.model.position = value;
    };
    
    public get direction(): number {
        return this.model.direction;
    };

    public set direction(value: number) {
        this.model.direction = value;
    };

    public path: RoomActorPath;

    public lastActivity: number = 0;

    private state: RoomPetState = RoomPetState.FREE;
    private posture: string = "std";

    public pose: RoomActorPose = new RoomPetPose(this);

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
    
    public sendDirectionEvent(): void {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            
            direction: this.direction,
        }));
    }

    public sendPositionEvent(usePath: boolean, roomActorActionsData?: RoomActorActionData | null) {
        this.room.sendProtobuff(RoomActorPositionData, RoomActorPositionData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            
            position: this.position,
            direction: this.direction,
            usePath,

            action: roomActorActionsData ?? undefined
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
        this.handleAutomaticChat();

        if(this.state === RoomPetState.FREE) {
            await this.handleRelaxed();
        }

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

    private lastChatMessage: number = 0;
    private nextChatMessageTimeout: number = 20;

    public handleAutomaticChat() {
        const elapsedSinceLastChatMessage = performance.now() - this.lastChatMessage;

        if(elapsedSinceLastChatMessage < this.nextChatMessageTimeout * 1000) {
            return;
        }

        this.lastChatMessage = performance.now();
        this.nextChatMessageTimeout = Math.round(5 + (Math.random() * 20));

        this.sendVocal("PLAYFUL");
    }

    public sendVocal(type: string) {
        if(this.room.model.muteAllPets) {
            return;
        }

        this.room.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },

            message: "",
            messageVocals: [ `pet.${this.model.pet.type}.${type}`, `pet.common.${type}` ],
            messageVocalIndex: Math.floor(Math.random() * 100),

            roomChatStyleId: "normal"
        }));
    }

    public sendInformationMessage(message: string) {
        this.room.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },

            message,

            roomChatStyleId: "generic"
        }));
    }

    public setPosture(posture: string) {
        this.posture = posture;

        if(posture === "sit") {
            if(this.direction % 2) {
                this.path.setDirection((this.direction + 1) % 8);
            }
        }
        
        this.room.sendProtobuff(RoomActorActionData, RoomActorActionData.create({
            actor: {
                pet: {
                    petId: this.model.id
                }
            },
            
            posture: this.posture
        }));
    }

    public setFree() {
        this.state = RoomPetState.FREE;

        this.setPosture("std");
        this.sendVocal("GENERIC_HAPPY");
    }

    public setSit() {
        this.state = RoomPetState.SIT;

        this.setPosture("sit");
        this.sendVocal("GENERIC_NEUTRAL");
    }
    
    public getActorIdentifier(): RoomActorIdentifierData {
        return RoomActorIdentifierData.create({
            pet: {
                petId: this.model.id
            }
        })
    }
}
