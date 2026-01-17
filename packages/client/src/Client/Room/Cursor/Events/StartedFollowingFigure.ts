import { RoomUserData } from "../../Interfaces/Room/RoomUserData.js";

export default class StartedFollowingFigure extends Event {
    constructor(public readonly userData: RoomUserData, public readonly position: { left: number, top: number }) {
        super("StartedFollowingFigure");
    }
}
