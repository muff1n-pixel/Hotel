import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import User from "../../Users/User";

export type RoomProtobuffListener<T> = ProtobuffListener<User, T>;
