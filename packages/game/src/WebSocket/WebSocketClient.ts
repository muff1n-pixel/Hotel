import ProtobuffListener from "@Client/Communications/ProtobuffListener.js";
import WebSocketEvent from "../../../shared/WebSocket/Events/WebSocketEvent.js";
import { MessageType, PingData, UnknownMessage } from "@pixel63/events";

export default class WebSocketClient extends EventTarget {
    private readonly socket: WebSocket;

    constructor(secure: boolean, hostname: string, port: number, options: Record<"userId" | "accessToken", string>) {
        super();

        this.socket = new WebSocket(`${(secure)?("wss"):("ws")}://${hostname}:${port}?${new URLSearchParams(options).toString()}`);

        this.socket.binaryType = "arraybuffer";

        this.socket.addEventListener("message", (event) => {
            if(event.data.toString() !== "[object ArrayBuffer]") {
                const events: [string, any, number | undefined][] = JSON.parse(event.data);

                for(const [type, data, timestamp] of events) {
                    console.log("Received " + type + " from server", data);

                    if(timestamp !== undefined) {
                        console.debug("Message received after " + (Date.now() - timestamp) + "ms");
                    }

                    this.dispatchEvent(new WebSocketEvent(type, data, (timestamp !== undefined)?(Date.now() - timestamp):(undefined)));
                }
            }
            else {
                const data = new Uint8Array(event.data);

                const sep = data.indexOf("|".charCodeAt(0));
                const type = new TextDecoder().decode(data.slice(0, sep));
                const payload = data.slice(sep + 1);

                console.log("Received222 " + type);

                this.dispatchEvent(new WebSocketEvent(type, payload, undefined));
            }
        });

        if(this.socket.readyState === this.socket.OPEN) {
            this.dispatchEvent(new Event("open"));
        }
        else {
            this.socket.addEventListener("open", () => {
                this.dispatchEvent(new Event("open"));
            });
        }
        
        this.socket.addEventListener("close", () => {
            this.dispatchEvent(new Event("close"));
        });

        setInterval(() => {
            if(this.socket.readyState === this.socket.OPEN) {
                this.sendProtobuff(PingData, PingData.create({}));
            }
        }, 30 * 1000);
    }

    public sendProtobuff<Message extends UnknownMessage = UnknownMessage>(message: MessageType, payload: Message) {
        const encoded = message.encode(payload).finish();

        this.sendEncodedProtobuff(message.$type, encoded);
    }

    private sendEncodedProtobuff(eventType: string, encoded: Uint8Array) {
        const typeBytes = new TextEncoder().encode(eventType + "|");

        const message = new Uint8Array(typeBytes.length + encoded.length);

        message.set(typeBytes, 0);
        message.set(encoded, typeBytes.length);

        this.socket.send(message);
    }

    public close() {
        this.socket.close();
    }

    addProtobuffListener<T>(message: MessageType, protobuffListener: ProtobuffListener<T>, options?: AddEventListenerOptions | boolean) {
        const listener = (event: WebSocketEvent<Uint8Array>) => {
            protobuffListener.handle(message.decode(event.data) as T);
        };

        this.addEventListener(message.$type, listener, options);

        return listener;
    }

    removeProtobuffListener(message: MessageType, listener: (event: WebSocketEvent<Uint8Array<ArrayBufferLike>>) => void) {
        this.removeEventListener(message.$type, listener);
    }

    addEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as (EventListenerOrEventListenerObject | null), options);
    }

    removeEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as (EventListenerOrEventListenerObject | null), options);
    }
};

(window as any).WebSocketClient = WebSocketClient;
