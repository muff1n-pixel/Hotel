import Room from "../Room.js";
import RoomActor from "../Actor/RoomActor.js";
import RoomActorPath from "../Actor/Path/RoomActorPath.js";
import { RoomActorActionData, RoomActorChatData, RoomActorIdentifierData, RoomActorPositionData, RoomActorWalkToData, RoomPetExperiencePointsData, RoomPetsData, RoomPositionData, RoomPositionOffsetData, ServerUserInventoryUpdatedData, UserPetData } from "@pixel63/events";
import { UserPetModel } from "../../../Database/Models/Users/Pets/UserPetModel.js";
import RoomActorPose from "../Actor/Poses/RoomActorPose.js";
import RoomPetPose from "../Actor/Poses/RoomPetPose.js";
import RoomServer from "../../RoomServer.js";
import Directions from "../../../Helpers/Directions.js";
import RoomPetActions from "./RoomPetActions.js";
import RoomFurniture from "../Furniture/RoomFurniture.js";
import RoomPetAction from "./Actions/Interfaces/RoomPetAction.js";
import RoomPetFreeAction from "./Actions/RoomPetFreeAction.js";

export enum RoomPetState {
    FREE = "free",
    SIT = "sit",
    LAY = "lay",
    STAND = "stand",
    BEG = "beg",
    PLAY_FOOTBALL = "play_football"
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

    public pose: RoomActorPose = new RoomPetPose(this);

    public action: RoomPetAction;

    constructor(public readonly room: Room, public readonly model: UserPetModel) {
        this.position = model.position;
        this.direction = model.direction;

        this.path = new RoomActorPath(this);
        this.action = new RoomPetFreeAction(this);
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

        RoomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
            userId: this.model.user.id,
            petsAdded: [ this.model.id ]
        }));
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
                    this.getPetData()
                ]
            }));
        }
    }

    public async handleActionsInterval() {
        this.handleAutomaticChat();

        if(this.action.expiresAt !== undefined) {
            if(performance.now() >= this.action.expiresAt) {
                this.action = new RoomPetFreeAction(this);
            }
        }

        await this.action.handleActionsInterval?.();

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

            roomChatStyleId: "generic",

            options: {
                hideUsername: true
            }
        }));
    }
    
    public getActorIdentifier(): RoomActorIdentifierData {
        return RoomActorIdentifierData.create({
            pet: {
                petId: this.model.id
            }
        })
    }
    
    public getOffsetPosition(offset: number, direction: number | null = this.model.direction): RoomPositionOffsetData {
        return Directions.getPositionFromOffset(offset, this.model.position, direction);
    }

    public async addExperiencePoints(points: number, energyDrained?: number) {
        this.model.experience += points;

        if(energyDrained !== undefined) {
            this.model.energy -= energyDrained;
        }

        if(this.model.level < 20) {
            if(this.model.experience >= this.getMaxExperience()) {
                this.model.level++;

                this.sendVocal("LEVEL_UP");
            }
        }

        await this.model.save();

        this.room.sendProtobuff(RoomPetExperiencePointsData, RoomPetExperiencePointsData.create({
            petId: this.model.id,
            experience: points
        }));

        this.room.sendProtobuff(RoomPetsData, RoomPetsData.fromJSON({
            petsUpdated: [
                this.getPetData()
            ]
        }));
    }

    public getPetData(): UserPetData {
        return UserPetData.fromJSON({
            ...this.model.toJSON(),

            userName: this.model.user.name,

            days: Math.round((new Date().getTime() - this.model.createdAt.getTime()) / (1000 * 60 * 60 * 24)),

            maxEnergy: this.getMaxEnergy(),
            maxExperience: this.getMaxExperience(),
            maxHappiness: this.getMaxHappiness()
        });
    }

    public getMaxEnergy() {
        return 80 + (this.model.level * 20);
    }

    public getMaxExperience() {
        const nextLevel = this.model.level + 1;

        return nextLevel * 100;
    }

    public getMaxHappiness() {
        return 100;
    }

    public async handleBeforeWalkEvent(previousPosition: RoomPositionOffsetData, newPosition: RoomPositionOffsetData) {
        const previousFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(previousPosition));
        const newFurniture = this.room.furnitures.filter((furniture) => furniture.isPositionInside(newPosition));

        for(const furniture of newFurniture) {
            await this.handleBeforeWalksOnFurniture?.(furniture, previousFurniture);
        }
    }

    public async handleBeforeWalksOnFurniture(roomFurniture: RoomFurniture, previousRoomFurniture: RoomFurniture[]): Promise<void> {
        return this.room.handleBeforeActorWalksOnFurniture(this, roomFurniture, previousRoomFurniture);
    }
}
