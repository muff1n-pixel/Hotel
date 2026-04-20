import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import { FigureAssets } from "src/library";
import RoomWorkerRenderer from "src/Workers/Room/RoomWorkerRenderer";

const roomWorkerRenderer = new RoomWorkerRenderer();

console.log("Started room worker renderer");

onmessage = async (event: MessageEvent) => {
    const port = event.ports[0];
    
    console.log("Received message in room worker renderer", event.data);

    switch(event.data.type) {
        case "setCanvasSize": {
            const { width, height } = event.data;
            
            roomWorkerRenderer.setCanvasSize(width, height);

            break;
        }
        
        case "render": {
            await FurnitureAssets.preloadAssets();

            roomWorkerRenderer.render(event.data.canvas, port);

            break;
        }

        case "addFurnitureItem": {
            const { item: { type, direction, animation, color, data, position } } = event.data;

            const furniture = new Furniture(type, 64, direction, animation, color);
            const item = new RoomFurnitureItem(roomWorkerRenderer, furniture, position, data);
    
            roomWorkerRenderer.items.push(item);

            break;
        }

        case "setCameraPosition": {
            roomWorkerRenderer.setCameraPosition(event.data.position);
            
            break;
        }

        case "setStructure": {
            roomWorkerRenderer.setStructure(event.data.structure);
            break;
        }

        case "getItemAtMousePosition": {
            const position = event.data.position;

            const item = roomWorkerRenderer.getItemAtMousePosition(position);

            port.postMessage({
                type: "itemAtMousePosition",
                item
            });
         
            break;
        }
    }
};
