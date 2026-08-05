import ProtobuffListener from "../../../Communication/Interfaces/ProtobuffListener";
import User from "../../Users/User";

export type UserProtobuffListener<T> = ProtobuffListener<User, T>;
