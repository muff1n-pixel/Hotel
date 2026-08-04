import { RoomWiredLogLevel } from "./RoomWiredLogLevel";

export default interface RoomWiredLog {
    level: RoomWiredLogLevel;
    category: string;
    message: string;
    timestamp: string;
}