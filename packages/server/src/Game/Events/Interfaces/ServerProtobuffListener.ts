import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import RoomServerClient from "../../Rooms/RoomServerClient";

export type ServerProtobuffListener<T> = ProtobuffListener<RoomServerClient, T>;
