import { CSSProperties, useEffect, useState } from "react";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { RoomStructureData } from "@pixel63/events";

export type RoomMapImageProps = {
    size?: number;
    width: number;
    height: number;
    structure: RoomStructureData;
    style?: CSSProperties;
    leftWallColor?: string[];
}

export default function RoomMapImage({ size = 6, width, height, style, structure, leftWallColor }: RoomMapImageProps) {
    const [dataUrl, setDataUrl] = useState("");

    useEffect(() => {
        (async () => {
            const fullSize = size / 2;

            const floorRenderer = new FloorRenderer(structure, structure.floor?.id ?? "default", size, true, true);
            const wallRenderer = new WallRenderer(structure, structure.wall?.id ?? "default", size, true);

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

            context.translate(Math.floor(translateLeft + (floorRenderer.rows * fullSize)), Math.floor(translateTop + (wallRenderer.depth + 3.5) * fullSize));

            context.drawImage(wallImage, -(wallRenderer.rows * fullSize), -((wallRenderer.depth + 3.5) * fullSize) - wallRenderer.wallThickness);
            context.drawImage(floor, -(floorRenderer.rows * fullSize), -(floorRenderer.depth * fullSize) - fullSize - floorRenderer.wallThickness);
            
            if(elevatedFloor) {
                context.drawImage(elevatedFloor, -(floorRenderer.rows * fullSize), -(floorRenderer.depth * fullSize) - fullSize - floorRenderer.wallThickness);
            }

            context.drawImage(doorMaskImage, -(wallRenderer.rows * fullSize), -((wallRenderer.depth + 3.5) * fullSize) - wallRenderer.wallThickness);

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
