import { MessageType, UnknownMessage } from "@pixel63/events";
import EventEmitter, { NodeEventTarget } from "node:events";

export default class ProtobuffMessaging extends EventEmitter {
    constructor(private _postMessage: (message: Uint8Array) => void) {
        super();
    }

    public handleProtobuffMessage(message: unknown) {
        try {
            let buffer: Buffer;

            if(message instanceof Uint8Array) {
                buffer = Buffer.from(message);
            } else if (typeof message === "string") {
                buffer = Buffer.from(message);
            } else if (message instanceof Buffer) {
                buffer = message;
            } else if (message instanceof ArrayBuffer) {
                buffer = Buffer.from(message);
            } else if (Array.isArray(message)) {
                buffer = Buffer.concat(message);
            } else {
                console.log(message);
                throw new Error("Unsupported RawData type");
            }

            const sep = buffer.indexOf("|".charCodeAt(0));
            const type = buffer.subarray(0, sep).toString("utf-8");
            const payload = buffer.subarray(sep + 1);

            console.log("Received " + type);

            this.emit(type, payload);
        }
        catch(error) {
            console.error("Failed to process Protobuff", error);
        }
    }
    
    public addProtobuffListener<T>(message: MessageType, protobuffListener: (payload: T) => Promise<void>) {
        const listener = async (payload: Uint8Array) => {
            try {
                await protobuffListener(message.decode(payload) as T);
            }
            catch(error) {
                console.error("Failed to process event", error);
            }
        };

        super.addListener(message.$type, listener);

        return listener;
    }

    public removeProtobuffListener<T>(message: MessageType, listener: (payload: T) => Promise<void>) {
        super.removeListener(message.$type, listener);
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        try {
            const encoded = message.encode(payload).finish();

            this.sendEncodedProtobuff(message.$type, encoded);
        }
        catch(error) {
            console.error("Failed to send Protobuff", error);
        }
    }

    private sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        try {
            const typeBytes = new TextEncoder().encode(eventType + "|");

            const message = new Uint8Array(typeBytes.length + encoded.length);

            message.set(typeBytes, 0);
            message.set(encoded, typeBytes.length);

            console.log("Sending", message);

            this._postMessage(message);
        }
        catch(error) {
            console.error("Failed to send encoded Protobuff", error);
        }
    }
}
