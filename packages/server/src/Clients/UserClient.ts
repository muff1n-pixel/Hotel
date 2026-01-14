import type WebSocket from "ws";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { User } from "../Database/Models/Users/User.js";
import { EventEmitter } from "node:events";

export default class UserClient extends EventEmitter {
    constructor(public readonly webSocket: WebSocket, public readonly user: User) {
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
}
