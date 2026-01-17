import FigureAssets from "@Client/Assets/FigureAssets";
import ClientInstance from "./ClientInstance";
import "@Client/../Workers/Figure/FigureRendererWorker";
import "@Client/Figure/Worker/FigureWorkerRenderer";
import WebSocketClient from "@Shared/WebSocket/WebSocketClient";
import { TypedEventTarget } from "@Shared/Interfaces/TypedEventTarget";

export async function createClientInstance(element: HTMLElement, internalEventTarget: TypedEventTarget, webSocketClient: WebSocketClient) {
    await FigureAssets.loadAssets();

    //console.log(JSON.stringify(FigureConfigurationHelper.getConfigurationFromString("hd-180-2.hr-828-31.ea-3196-62.ch-255-1415.lg-3216-110.sh-305-62")));

    const clientInstance = new ClientInstance(element, internalEventTarget, webSocketClient);

    return clientInstance;
}
