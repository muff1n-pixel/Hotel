import { CSSProperties, useEffect, useRef, useState } from "react";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { RoomStructureData } from "@pixel63/events";
import RoomStructure from "@Client/Room/Structure/RoomStructure";

export type RoomMapImageProps = {
    size?: number;
    width: number;
    height: number;
    structure: RoomStructureData;
    style?: CSSProperties;
    leftWallColor?: string[];
    staticImage?: boolean;
}

export default function RoomMapImage({ staticImage, size = 6, width, height, style, structure, leftWallColor }: RoomMapImageProps) {
    const rendered = useRef<boolean>(false);

    const [dataUrl, setDataUrl] = useState("");

    useEffect(() => {
        if(staticImage && rendered.current) {
            return;
        }

        const roomStructure = new RoomStructure(structure);

        rendered.current = true;
        
        (async () => {
            const fullSize = size / 2;

            const floorRenderer = new FloorRenderer(roomStructure, structure.floor?.id ?? "default", size, true, true);
            const wallRenderer = new WallRenderer(roomStructure, structure.wall?.id ?? "default", size, true);

            const [ [ floor, elevatedFloor ], [wallImage, doorMaskImage] ] = await Promise.all([
                (async () => {
                    const { floor, elevatedFloor } = await floorRenderer.renderOffScreen();

                    return [ floor, elevatedFloor ];
                })(),
                
                (async () => {
                    const { wall, doorMask } = await wallRenderer.renderOffScreen(leftWallColor);

                    return [
                        wall,
                        doorMask
                    ];
                })()
            ]);

            const canvas = document.createElement("canvas");
            canvas.width = Math.max(wallImage.width, floor.width, elevatedFloor?.width ?? 0);
            canvas.height = Math.max(wallImage.height, floor.height, elevatedFloor?.height ?? 0);

            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            let translateLeft = 0, translateTop = 0;

            if(canvas.width < width) {
                const difference = width - canvas.width;

                translateLeft = difference / 2;

                canvas.width = width;
            }

            if(canvas.height < height) {
                const difference = height - canvas.height;

                translateTop = difference / 2;

                canvas.height = height;
            }

            context.translate(Math.floor(translateLeft + (roomStructure.rows * fullSize)), Math.floor(translateTop + (roomStructure.wallDepth + 3.5) * fullSize));

            context.drawImage(wallImage, -(roomStructure.rows * fullSize), -((roomStructure.wallDepth + 3.5) * fullSize) - wallRenderer.wallThickness);
            context.drawImage(floor, -(roomStructure.rows * fullSize), -(roomStructure.depth * fullSize) - fullSize - floorRenderer.wallThickness);
            
            if(elevatedFloor) {
                context.drawImage(elevatedFloor, -(roomStructure.rows * fullSize), -(roomStructure.depth * fullSize) - fullSize - floorRenderer.wallThickness);
            }

            context.drawImage(doorMaskImage, -(roomStructure.rows * fullSize), -((roomStructure.wallDepth + 3.5) * fullSize) - wallRenderer.wallThickness);

            setDataUrl(canvas.toDataURL("image/png"));

            canvas.remove();
        })();
    }, [ structure, size ]);

    return (
        <img src={dataUrl} style={{
            objectFit: "contain",

            width: "100%",
            height: "100%",

            ...style
        }}/>
    );
}
