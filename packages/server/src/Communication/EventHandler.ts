import { MessageType } from "@pixel63/events";
import { EventEmitter } from "node:events";
import { RawData } from "ws";
import ProtobuffListener from "./Interfaces/ProtobuffListener";

export default class EventHandler<User> extends EventEmitter {
    constructor() {
        super();

        super.setMaxListeners(1);
    }

    public decodeAndDispatchMessages(user: User, rawData: RawData) {
        try {
            let buffer: Buffer;

            if (typeof rawData === "string") {
                buffer = Buffer.from(rawData);
            } else if (rawData instanceof Buffer) {
                buffer = rawData;
            } else if (rawData instanceof ArrayBuffer) {
                buffer = Buffer.from(rawData);
            } else if (Array.isArray(rawData)) {
                buffer = Buffer.concat(rawData);
            } else {
                throw new Error("Unsupported RawData type");
            }

            const sep = buffer.indexOf("|".charCodeAt(0));
            const type = buffer.subarray(0, sep).toString("utf-8");
            const payload = buffer.subarray(sep + 1);

            console.log("Received " + type);

            this.emit(type, user, payload/*, user.spamProtection.getDurationSinceLastEvent(type)*/);
        }
        catch(error) {
            console.error("Failed to process Protobuff", error);
        }
    }

    addProtobuffListener<T>(message: MessageType, protobuffListener: ProtobuffListener<User, T>) {
        super.addListener(message.$type, (user: User, event, durationSinceLastEvent) => {
            if(protobuffListener.minimumDurationBetweenEvents !== undefined) {
                if(durationSinceLastEvent < protobuffListener.minimumDurationBetweenEvents) {
                    console.warn("Ignoring event from user, duration since last event " + durationSinceLastEvent + " is less than allowed " + protobuffListener.minimumDurationBetweenEvents);
                    
                    return;
                }
            }

            protobuffListener.handle(user, message.decode(event) as T).catch(console.error);

            //user.spamProtection.registerEventTimestamp(message.$type);
        });

        return this;
    }

    removeProtobuffListener(message: MessageType, listener: (event: Uint8Array<ArrayBufferLike>) => void) {
        super.removeListener(message.$type, listener);
    }
}
