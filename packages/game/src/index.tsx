import WebSocketClient from "./WebSocket/WebSocketClient";
import ClientInstance from "@Client/ClientInstance";
import UserInterfaceInstance from "./UserInterface";
import FigureAssets from "@Client/Assets/FigureAssets";
import LoaderInstance from "./Loader";

const clientElement = document.getElementById("client");
const interfaceElement = document.getElementById("interface");
const loaderElement = document.getElementById("loader");

if(!clientElement) {
    throw new Error("Client root element is not created.");
}

if(!interfaceElement) {
    throw new Error("User interface root element is not created.");
}

if(!loaderElement) {
    throw new Error("Loader root element is not created.");
}

export const loaderInstance = new LoaderInstance(loaderElement);

loaderInstance.render();

const searchParams = new URLSearchParams(window.location.search);

export const webSocketClient = new WebSocketClient({
    userId: searchParams.get("user") ?? "user1"
});

export const clientInstance = new ClientInstance(clientElement);
export const userInterface = new UserInterfaceInstance(interfaceElement);

webSocketClient.addEventListener("open", async () => {
    await FigureAssets.loadAssets();

    userInterface.render();

    loaderElement.style.display = "none";
});
