import FurnitureRenderer from "./Furniture/FurnitureRenderer.js";
import RoomFloorSprite from "./Room/Items/Floor/RoomFloorSprite.js";
import RoomFurnitureItem from "./Room/Items/Furniture/RoomFurnitureItem.js";
import RoomItem from "./Room/Items/RoomItem.js";
import RoomRenderer from "./Room/Renderer.js";
import FloorRenderer from "./Room/Structure/FloorRenderer.js";

console.log("Hello world");

const root = document.getElementById("game");

if(root) {
    const roomRenderer = new RoomRenderer(root);

    const floorItem = new RoomItem([]);

    const floorSprite = new RoomFloorSprite(
        floorItem,
        new FloorRenderer({
            grid: [
                "000",
                "000",
                "000"
            ],
            floor: {
                thickness: 8
            },
            wall: {
                thickness: 8
            }
        }, {
            left: "#CCC",
            right: "#DDD",
            tile: "#FFF"
        })
    );

    floorItem.sprites.push(floorSprite);

    roomRenderer.items.push(floorItem);

    {
        const furnitureRenderer = new FurnitureRenderer("bed_armas_two", 64, 2);

        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 0,
            column: 0,
            depth: 0
        });

        roomRenderer.items.push(furnitureItem);
    }

    {
        const furnitureRenderer = new FurnitureRenderer("divider_arm2", 64, 0);
        
        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 2,
            column: 0,
            depth: 0
        });

        roomRenderer.items.push(furnitureItem);
    }

    {
        const canvas = document.createElement("canvas");
        canvas.classList.add("debug");
        document.body.appendChild(canvas);
        
        canvas.width = 200;
        canvas.height = 200;

        const context = canvas.getContext("2d");

        const furnitureRenderer = new FurnitureRenderer("bed_armas_two", 64, 2);

        furnitureRenderer.renderToCanvas().then((canvas) => {
            context?.drawImage(canvas, 0, 0);
        });
    }
}
