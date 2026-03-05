import RoomUser from "../../Rooms/Users/RoomUser";

export default interface ProtobuffWorkerListener<T> {
    handle(user: RoomUser, payload: T): Promise<void>;
}
