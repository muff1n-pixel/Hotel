import WebSocketClient from "./WebSocket/WebSocketClient";
import ClientInstance from "@Client/ClientInstance";
import UserInterfaceInstance from "./UserInterface";
import FigureAssets from "@Client/Assets/FigureAssets";
import LoaderInstance from "./Loader";

const clientElement = document.getElementById("client");
const interfaceElement = document.getElementById("interface");
const loaderElement = document.getElementById("loader");

const searchParams = new URLSearchParams(window.location.search);

export let loaderInstance: LoaderInstance;
export let webSocketClient: WebSocketClient;
export let clientInstance: ClientInstance;
export let userInterface: UserInterfaceInstance;

start();

function start(text?: string) {
    if(!clientElement) {
        throw new Error("Client root element is not created.");
    }

    if(!interfaceElement) {
        throw new Error("User interface root element is not created.");
    }

    if(!loaderElement) {
        throw new Error("Loader root element is not created.");
    }

    loaderInstance = new LoaderInstance(loaderElement);
    
    loaderInstance.render(text);

    webSocketClient = new WebSocketClient({
        userId: searchParams.get("user") ?? "user1"
    });

    clientInstance = new ClientInstance(clientElement);
    userInterface = new UserInterfaceInstance(interfaceElement);

    webSocketClient.addEventListener("open", async () => {
        await FigureAssets.loadAssets();

        userInterface.render();

        loaderInstance.hide();
    });

    webSocketClient.addEventListener("close", () => {
        userInterface.destroy();
        clientInstance.destroy();
        loaderInstance.destroy();

        start("Reconnecting...");
    });
}
