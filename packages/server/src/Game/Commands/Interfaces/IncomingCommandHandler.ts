import RoomUser from "../../Rooms/Users/RoomUser";

export default interface IncomingCommandHandler {
    command: string;

    handle(roomUser: RoomUser, inputs: string[]): Promise<void>;
};
