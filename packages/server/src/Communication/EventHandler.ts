import { MessageType, UnknownMessage } from "@pixel63/events";
import { EventEmitter } from "node:events";
import { RawData } from "ws";
import ProtobuffListener from "./Interfaces/ProtobuffListener";

export default class EventHandler<User> extends EventEmitter {
    constructor(private readonly log?: (user: User, type: string, payload: unknown) => void) {
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

            this.log?.(user, type, payload);

            this.emit(type, user, payload/*, user.spamProtection.getDurationSinceLastEvent(type)*/);
        }
        catch(error) {
            console.error("Failed to process Protobuff", error);
        }
    }

    addProtobuffListener<T>(message: MessageType, protobuffListener: ProtobuffListener<User, T>) {
        const listener = (user: User, event: Uint8Array<ArrayBufferLike>, durationSinceLastEvent: number) => {
            if(protobuffListener.minimumDurationBetweenEvents !== undefined) {
                if(durationSinceLastEvent < protobuffListener.minimumDurationBetweenEvents) {
                    console.warn("Ignoring event from user, duration since last event " + durationSinceLastEvent + " is less than allowed " + protobuffListener.minimumDurationBetweenEvents);
                    
                    return;
                }
            }

            protobuffListener.handle(user, message.decode(event) as T).catch(console.error);

            //user.spamProtection.registerEventTimestamp(message.$type);
        };

        super.addListener(message.$type, listener);

        return listener;
    }

    removeProtobuffListener(message: MessageType, listener: (...args: any[]) => void) {
        super.removeListener(message.$type, listener);
    }
}
