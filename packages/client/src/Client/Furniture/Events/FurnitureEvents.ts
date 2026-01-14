import ClientFurnitureRequest from "@shared/events/Furniture/ClientFurnitureRequest.js";
import ClientFurnitureResponse from "@shared/events/Furniture/ClientFurnitureResponse.js";
import ClientInstance from "@/ClientInstance.js";
import FurnitureRenderer from "../FurnitureRenderer.js";

export default function registerFurnitureEvents(clientInstance: ClientInstance) {
    clientInstance.internalEventTarget.addEventListener<ClientFurnitureRequest>("ClientFurnitureRequest", (event) => {
        const furnitureRenderer = new FurnitureRenderer(event.type, event.size, event.direction, event.animation, event.color);

        furnitureRenderer.renderToCanvas().then((image) => {
            clientInstance.internalEventTarget.dispatchEvent(new ClientFurnitureResponse(event.id, image));
        });
    });
}
