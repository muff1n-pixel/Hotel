import ClientFurnitureRequest from "@Shared/events/Furniture/ClientFurnitureRequest";
import ClientFurnitureResponse from "@Shared/events/Furniture/ClientFurnitureResponse";
import ClientInstance from "@Client/ClientInstance";
import FurnitureRenderer from "../FurnitureRenderer";

export default function registerFurnitureEvents(clientInstance: ClientInstance) {
    clientInstance.internalEventTarget.addEventListener<ClientFurnitureRequest>("ClientFurnitureRequest", (event) => {
        const furnitureRenderer = new FurnitureRenderer(event.type, event.size, event.direction, event.animation, event.color);

        furnitureRenderer.renderToCanvas().then((image) => {
            clientInstance.internalEventTarget.dispatchEvent(new ClientFurnitureResponse(event.id, image));
        });
    });
}
