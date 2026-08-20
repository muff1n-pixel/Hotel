import RoomPet, { RoomPetState } from "./RoomPet";

export default class RoomPetActions {
    private _state: RoomPetState = RoomPetState.FREE;
    public stateUpdatedAt: number = performance.now();

    public get state() {
        return this._state;
    }

    public set state(state: RoomPetState) {
        this._state = state;
        this.stateUpdatedAt = performance.now();
    }

    constructor(private readonly roomPet: RoomPet) {

    }

    public async handleActionsInterval() {
        if(this.state === RoomPetState.FREE) {
            await this.roomPet.handleRelaxed();
        }
        else if(this.state === RoomPetState.STAND) {
            if(performance.now() - this.stateUpdatedAt > 5000) {
                this.state = RoomPetState.FREE;

                this.roomPet.pose.stand();
            }
        }
    }
    
    public free() {
        this.state = RoomPetState.FREE;

        this.roomPet.pose.stand();
        this.roomPet.sendVocal("GENERIC_HAPPY");
    }

    public sit() {
        this.state = RoomPetState.SIT;

        this.roomPet.pose.sit();
        this.roomPet.sendVocal("GENERIC_NEUTRAL");
    }

    public lay() {
        this.state = RoomPetState.LAY;

        this.roomPet.pose.lay();
        this.roomPet.sendVocal("GENERIC_NEUTRAL");
    }

    public stand() {
        this.state = RoomPetState.STAND;

        this.roomPet.pose.stand();
        this.roomPet.sendVocal("GENERIC_NEUTRAL");
    }
}
