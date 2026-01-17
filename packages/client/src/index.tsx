import WebSocketClient from "./WebSocket/WebSocketClient";
import ClientInstance from "@Client/ClientInstance";
import UserInterfaceInstance from "./UserInterface";
import FigureAssets from "@Client/Assets/FigureAssets";

const clientElement = document.getElementById("client");
const interfaceElement = document.getElementById("interface");

if(!clientElement) {
    throw new Error("Client root element is not created.");
}

if(!interfaceElement) {
    throw new Error("User interface root element is not created.");
}

export const webSocketClient = new WebSocketClient({
    userId: "user1"
});

export const clientInstance = new ClientInstance(clientElement);
export const userInterface = new UserInterfaceInstance(interfaceElement);

webSocketClient.addEventListener("open", async () => {
    await FigureAssets.loadAssets();

    userInterface.render();
});
