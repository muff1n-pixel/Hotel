import { RoomOwnerInterface } from "./Owner/RoomOwnerInterface";

export interface RoomInterface {
    id: string,
    type: string,
    name: string,
    description: string,
    owner: RoomOwnerInterface | null,
    thumbnail: string,
    currentUsers: number,
    maxUsers: number,
    lock: string
}