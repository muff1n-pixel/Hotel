import WebSocketClient from "./WebSocket/WebSocketClient";
import ClientInstance from "@Client/ClientInstance";
import UserInterfaceInstance from "./UserInterface";
import FigureAssets from "@Client/Assets/FigureAssets";
import LoaderInstance from "./Loader";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import Cookies from "js-cookie";
import Figure from "@Client/Figure/Figure";

import "./Polyfills/OffscreenCanvas";

const clientElement = document.getElementById("client");
const interfaceElement = document.getElementById("interface");
const loaderElement = document.getElementById("loader");

const searchParams = new URLSearchParams(window.location.search);

export let loaderInstance: LoaderInstance;
export let webSocketClient: WebSocketClient;
export let clientInstance: ClientInstance;
export let userInterface: UserInterfaceInstance;

start();

async function start(text?: string) {
    if (searchParams.get("avatarImager") !== null) {
        try {
            const figureConfiguration = JSON.parse(decodeURIComponent(searchParams.get("avatarImager") as string));

            const direction = parseInt(searchParams.get("direction") as string) || 2;
            const actions = JSON.parse(decodeURIComponent(searchParams.get("actions") as string)) || [];
            const frame = parseInt(searchParams.get("frame") as string) || 0;
            const headOnly = Boolean(parseInt(searchParams.get("headOnly") as string)) || undefined;

            const furnitureRenderer = new Figure(figureConfiguration, direction, ["wav"], headOnly);

            document.body.innerHTML = "";

            window.generateAvatar = async () => {
                const rendered = await furnitureRenderer.renderToCanvas(Figure.figureWorker, frame, true);
                const bitmap = rendered.figure.image as ImageBitmap;
                const canvas = document.createElement("canvas");
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(bitmap, 0, 0);
                return canvas.toDataURL("image/png");
            };
        } catch (e) {
            console.error("Failed to parse figure configuration.", e);
        }
        return;
    }

    const response = await fetch("/game/config.json", {
        headers: {
            "Accept": "application/json"
        }
    });

    const config = await response.json();

    if (!clientElement) {
        throw new Error("Client root element is not created.");
    }

    if (!interfaceElement) {
        throw new Error("User interface root element is not created.");
    }

    if (!loaderElement) {
        throw new Error("Loader root element is not created.");
    }

    loaderInstance = new LoaderInstance(loaderElement);

    loaderInstance.render(text);

    webSocketClient = new WebSocketClient(
        config.server.secure,
        config.server.hostname,
        config.server.port,
        {
            accessToken: Cookies.get("accessToken") ?? "",
            userId: searchParams.get("user") ?? "user1"
        }
    );

    clientInstance = new ClientInstance(clientElement);
    userInterface = new UserInterfaceInstance(interfaceElement);

    webSocketClient.addEventListener("open", async () => {
        await FigureAssets.loadAssets();
        await FurnitureAssets.preloadAssets();

        userInterface.render();

        loaderInstance.hide();
    });

    webSocketClient.addEventListener("close", () => {
        userInterface.destroy();
        clientInstance.destroy();

        const loaderInstance = new LoaderInstance(loaderElement);

        loaderInstance.render("Disconnected");
    });
}
