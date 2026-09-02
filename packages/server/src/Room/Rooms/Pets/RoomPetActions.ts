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
        switch(this.state) {
            case RoomPetState.FREE: {
                await this.roomPet.handleRelaxed();

                break;
            }
            
            case RoomPetState.STAND:
            case RoomPetState.LAY:
            case RoomPetState.SIT: {
                if(performance.now() - this.stateUpdatedAt > 5000) {
                    this.free();
                }

                break;
            }
            
            case RoomPetState.BEG: {
                if(performance.now() - this.stateUpdatedAt > 1000) {
                    this.free();
                }

                break;
            }
        }
    }
    
    public free() {
        this.state = RoomPetState.FREE;

        this.roomPet.pose.stand();
        this.roomPet.sendVocal("GENERIC_HAPPY");
    }

    public sit() {
        this.roomPet.path.finishPath();

        this.state = RoomPetState.SIT;

        this.roomPet.pose.sit();
        this.roomPet.sendVocal("GENERIC_NEUTRAL");
    }

    public lay() {
        this.roomPet.path.finishPath();

        this.state = RoomPetState.LAY;

        this.roomPet.pose.lay();
        this.roomPet.sendVocal("GENERIC_NEUTRAL");
    }

    public beg() {
        this.roomPet.path.finishPath();

        this.state = RoomPetState.BEG;

        this.roomPet.pose.beg();
        this.roomPet.sendVocal("HUNGRY");
    }

    public stand() {
        this.roomPet.path.finishPath();

        this.state = RoomPetState.STAND;

        this.roomPet.pose.stand();
        this.roomPet.sendVocal("GENERIC_NEUTRAL");
    }
}
