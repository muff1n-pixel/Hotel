import WebSocketEvent from "../../../shared/WebSocket/Events/WebSocketEvent.js";

export default class WebSocketClient extends EventTarget {
    private readonly socket: WebSocket;

    constructor(port: number, options: Record<"userId" | "accessToken", string>) {
        super();

        this.socket = new WebSocket(`${(window.location.protocol === "https:")?("wss"):("ws")}://${window.location.hostname}:${port}?${new URLSearchParams(options).toString()}`);

        this.socket.addEventListener("message", (event) => {
            const events: [string, any, number | undefined][] = JSON.parse(event.data);

            for(const [type, data, timestamp] of events) {
                console.log("Received " + type + " from server", data);

                if(timestamp !== undefined) {
                    console.debug("Message received after " + (Date.now() - timestamp) + "ms");
                }

                this.dispatchEvent(new WebSocketEvent(type, data, (timestamp !== undefined)?(Date.now() - timestamp):(undefined)));
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
    }

    send<T>(type: string, data: T) {
        this.socket.send(JSON.stringify([[type, data]]));
    }

    public close() {
        this.socket.close();
    }

    addEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: AddEventListenerOptions | boolean): void {
        super.addEventListener(type, callback as (EventListenerOrEventListenerObject | null), options);
    }

    removeEventListener<T>(type: string, callback: ((event: T) => void) | null, options?: EventListenerOptions | boolean): void {
        super.removeEventListener(type, callback as (EventListenerOrEventListenerObject | null), options);
    }
};

(window as any).WebSocketClient = WebSocketClient;
