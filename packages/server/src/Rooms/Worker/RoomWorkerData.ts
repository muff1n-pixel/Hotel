import User from "../../Users/User";

export default interface RoomWorkerData {
    id: string;
    loaded: boolean;
    users: User[];
}
