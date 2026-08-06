import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import RoomWorker from "../../Rooms/RoomWorker";
import RoomWorkerWebSocket from "../../Rooms/RoomWorkerWebSocket";

export type ServerProtobuffListener<T> = ProtobuffListener<RoomWorker, T>;
