import WebSocketClient from "@shared/WebSocket/WebSocketClient";
import { createInterfaceInstance } from "./UserInterface";
import { TypedEventTarget } from "./UserInterface/contexts/AppContext";
import { createClientInstance } from "./Client";

const clientElement = document.getElementById("client");
const interfaceElement = document.getElementById("interface");

if(!clientElement) {
    throw new Error("Client root element is not created.");
}

if(!interfaceElement) {
    throw new Error("User interface root element is not created.");
}

const internalEventTarget = new EventTarget() as TypedEventTarget;

const webSocketClient = new WebSocketClient({
    userId: "user1"
});

webSocketClient.addEventListener("open", async () => {
    const clientInstance = await createClientInstance(clientElement, internalEventTarget, webSocketClient);
    const userInterface = createInterfaceInstance(interfaceElement, internalEventTarget, webSocketClient);
});
