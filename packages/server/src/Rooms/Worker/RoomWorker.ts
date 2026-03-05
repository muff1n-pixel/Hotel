import { Worker } from "worker_threads";
import RoomWorkerData from "./RoomWorkerData.js";
import EventEmitter from "events";
import ProtobuffMessaging from "../../Communication/ProtobuffMessaging.js";

export default class RoomWorker extends EventEmitter {
    private worker: Worker;
    public messaging: ProtobuffMessaging;
    public rooms: RoomWorkerData[] = [];

    constructor() {
        super();

        this.worker = new Worker("./build/worker.js");

        this.messaging = new ProtobuffMessaging((message) => this.worker.postMessage(message));

        this.worker.addListener("message", (event: MessageEvent) => {
            this.messaging.handleProtobuffMessage(event.data)
        });
    }

    public getRoom(roomId: string) {
        return this.rooms.find((room) => room.id === roomId);
    }
}