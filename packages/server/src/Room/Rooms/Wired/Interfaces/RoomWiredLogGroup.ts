import { RoomWiredLogLevel } from "./RoomWiredLogLevel";

export default interface RoomWiredLogGroup {
    level: RoomWiredLogLevel;
    category: string;
    amount: number;
    latestTimestamp: string;
}