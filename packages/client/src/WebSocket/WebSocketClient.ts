import WebSocketEvent from "../../../shared/WebSocket/Events/WebSocketEvent.js";

export default class WebSocketClient extends EventTarget {
    private readonly socket: WebSocket;

    constructor(options: Record<"userId", string>) {
        super();

        this.socket = new WebSocket(`ws://localhost:7632?${new URLSearchParams(options).toString()}`);

        this.socket.addEventListener("message", (event) => {
            const events: [string, any][] = JSON.parse(event.data);

            for(let [type, data] of events) {
                console.log("Received " + type + " from server", data);

                this.dispatchEvent(new WebSocketEvent(type, data));
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
    }

    send<T>(type: string, data: T) {
        this.socket.send(JSON.stringify([[type, data]]));
    }

    addEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as (EventListenerOrEventListenerObject | null), options);
    }

    removeEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as (EventListenerOrEventListenerObject | null), options);
    }
};

(window as any).WebSocketClient = WebSocketClient;
