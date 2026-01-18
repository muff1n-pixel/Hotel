import type WebSocket from "ws";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { EventEmitter } from "node:events";
import UserInventory from "../Users/Inventory/UserInventory.js";

export default class UserClient extends EventEmitter {
    private inventory?: UserInventory;

    constructor(public readonly webSocket: WebSocket, public readonly user: UserModel) {
        super();
    }

    send(events: OutgoingEvent | OutgoingEvent[]) {
        if(events instanceof OutgoingEvent) {
            events = [ events ];
        }

        const payload = JSON.stringify(events.map((event) => [ event.name, event.body ]));

        console.debug("Sending: " + events.map((event) => event.name).join(', '));
        
        this.webSocket.send(payload);
    };

    addListener<T>(eventName: string | symbol, listener: (client: UserClient, event: T) => void): this {
        return super.addListener(eventName, listener);
    }

    public getInventory() {
        if(!this.inventory) {
            this.inventory = new UserInventory(this);
        }

        return this.inventory;
    }
}
