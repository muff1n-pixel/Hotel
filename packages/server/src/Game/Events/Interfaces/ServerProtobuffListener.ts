import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import RoomServer from "../../Rooms/RoomServer";
import RoomServerClient from "../../Rooms/RoomServerClient";

export type ServerProtobuffListener<T> = ProtobuffListener<RoomServer, T>;
