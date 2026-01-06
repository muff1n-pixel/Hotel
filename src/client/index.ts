import DebugRoomFurniture from "./Debug/DebugRoomFurniture.js";
import RoomClickEvent from "./Events/RoomClickEvent.js";
import FigureRenderer from "./Figure/FigureRenderer.js";
import FurnitureRenderer from "./Furniture/FurnitureRenderer.js";
import { RoomStructure } from "./Interfaces/RoomStructure.js";
import RoomFigureItem from "./Room/Items/Figure/RoomFigureItem.js";
import RoomFloorSprite from "./Room/Items/Floor/RoomFloorSprite.js";
import RoomWallSprite from "./Room/Items/Floor/RoomWallSprite.js";
import RoomFurnitureItem from "./Room/Items/Furniture/RoomFurnitureItem.js";
import RoomMapItem from "./Room/Items/Map/RoomFurnitureItem.js";
import RoomItem from "./Room/Items/RoomItem.js";
import RoomRenderer from "./Room/Renderer.js";
import FloorRenderer from "./Room/Structure/FloorRenderer.js";
import WallRenderer from "./Room/Structure/WallRenderer.js";

console.log("Hello world");

const root = document.getElementById("game");

if(root) {
    const roomRenderer = new RoomRenderer(root);

    const roomStructure: RoomStructure = {
        door: {
            row: 6,
            column: 0
        },
        grid: [
            "XXXXXX2XXXXXXXXXXXXXXXXXX",
            "X22222222222222222222222X",
            "X22222222222222222222222X",
            "X22222222222222222222222X",
            "X22222222222222222222222X",
            "X22222222222222222222222X",
            "222222222222222222222222X",
            "X22222222222222222222222X",
            "X22222222222222222222222X",
            "X22222222222222222222222X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X11111111111111111111111X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "XXXXXXXXXXX000XXXXXXXXXXX",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "X00000000000000000000000X",
            "XXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        floor: {
            thickness: 8
        },
        wall: {
            thickness: 8
        }
    };

    roomRenderer.items.push(new RoomMapItem(
        new FloorRenderer(roomStructure, "101", 64),
        new WallRenderer(roomStructure, "2301", 64)
    ));

    {
        const furnitureRenderer = new FurnitureRenderer("bed_armas_two", 64, 2);

        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 1,
            column: 1,
            depth: 2
        });

        //roomRenderer.items.push(furnitureItem);
    }

    {
        const furnitureRenderer = new FurnitureRenderer("divider_arm2", 64, 0);
        
        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 3,
            column: 1,
            depth: 2
        });

        roomRenderer.items.push(furnitureItem);
    }

    {
        const furnitureRenderer = new FurnitureRenderer("country_fnc3", 64, 0);
        
        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 6,
            column: 0,
            depth: 2
        });

        roomRenderer.items.push(furnitureItem);
    }

    {
        const furnitureRenderer = new FurnitureRenderer("country_fnc3", 64, 0);
        
        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 7,
            column: 1,
            depth: 2
        });

        roomRenderer.items.push(furnitureItem);
    }

    for(let row = 12; row < 21; row++) {
        for(let column = 2; column < 25; column++) {
            const furnitureRenderer = new FurnitureRenderer("nft_rare_dragonlamp", 64, 2, 1, 1);
            
            const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
                row: row,
                column: column,
                depth: 2
            });

            roomRenderer.items.push(furnitureItem);
        }
    }

    for(let row = 22; row < 30; row++) {
        for(let column = 2; column < 25; column++) {
            const furnitureRenderer = new FurnitureRenderer("nft_rare_dragonlamp", 64, 4, 1);
            
            const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
                row: row,
                column: column,
                depth: 1
            });

            roomRenderer.items.push(furnitureItem);
        }
    }

    for(let row = 38; row < 46; row++) {
        for(let column = 2; column < 25; column++) {
            const furnitureRenderer = new FurnitureRenderer("nft_rare_dragonlamp", 64, 4, 1, 5);
            
            const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
                row: row,
                column: column,
                depth: 1
            });

            roomRenderer.items.push(furnitureItem);
        }
    }

    {
        const furnitureRenderer = new FurnitureRenderer("nft_rare_dragonlamp", 64, 2);
        
        const furnitureItem = new RoomFurnitureItem(furnitureRenderer, {
            row: 6,
            column: 6,
            depth: 3
        });

        roomRenderer.items.push(furnitureItem);

        new DebugRoomFurniture(roomRenderer, furnitureItem);
    }

    /*{
        const canvas = document.createElement("canvas");
        canvas.classList.add("debug");
        document.body.appendChild(canvas);
        
        canvas.width = 200;
        canvas.height = 200;

        const context = canvas.getContext("2d");

        const furnitureRenderer = new FurnitureRenderer("nft_rare_dragonlamp", 64, 4);

        furnitureRenderer.renderToCanvas().then((canvas) => {
            context?.drawImage(canvas, 0, 0);
        });
    }*/

    {
        const canvas = document.createElement("canvas");
        canvas.classList.add("debug");
        document.body.appendChild(canvas);
        
        canvas.width = 200;
        canvas.height = 200;

        const context = canvas.getContext("2d");

        const figureRenderer = new FigureRenderer(FigureRenderer.getConfigurationFromString("hr-831-1041.hd-185-1026.ch-805-1134.lg-285-1200.sh-300-1195.ha-0-1041"));

        /*const figureRenderer = new FigureRenderer([
            {
                type: "hr",
                setId: "831",
                colorIndex: 1
            }
        ]);*/

        figureRenderer.renderToCanvas().then((canvas) => {
            context?.drawImage(canvas, 0, 0);
        });

        const figureItem = new RoomFigureItem(figureRenderer, {
            row: 1,
            column: 1,
            depth: 2
        });

        roomRenderer.items.push(figureItem);

        roomRenderer.cursor.addEventListener("click", (event: Event) => {
            if(!(event instanceof RoomClickEvent)) {
                return;
            }

            if(event.floorEntity) {
                figureItem.setPosition(event.floorEntity.position); 
            }
        });
    }
}
