import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import RoomWebSocketUser from "../../Server/Users/RoomWebSocketUser";

export type RoomProtobuffListener<T> = ProtobuffListener<RoomWebSocketUser, T>;
