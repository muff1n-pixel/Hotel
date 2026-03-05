export type RoomWorkerMessage = {
    type: "load";
    roomId: string;
} | {
    type: "loaded";
    roomId: string;
} | {
    type: "unload";
    roomId: string;
} | {
    type: "message";
} | {
    type: "add user";
    roomId: string;
    userId: string;
};
