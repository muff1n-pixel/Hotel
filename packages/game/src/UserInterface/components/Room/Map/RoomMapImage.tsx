import { CSSProperties, useEffect, useRef, useState } from "react";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import Furniture from "@Client/Furniture/Furniture";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export type RoomMapImageProps = {
    width: number;
    height: number;
    structure: RoomStructure;
    style: CSSProperties;
}

export default function RoomMapImage({ width, height, style, structure }: RoomMapImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendered = useRef(false);

    useEffect(() => {
        if(!canvasRef.current) {
            return;
        }

        if(rendered.current) {
            return;
        }

        rendered.current = true;

        (async () => {
            const size = 6;
            const fullSize = size / 2;
            const halfSize = fullSize / 2;

            const floorRenderer = new FloorRenderer(structure, structure.floor.id, size);
            const wallRenderer = new WallRenderer(structure, structure.wall.id, size);

            const [ floorImage, [wallImage, doorMaskImage] ] = await Promise.all([
                new Promise<ImageBitmap>(async (resolve) => {
                    const floorImage = await floorRenderer.renderOffScreen();

                    resolve(await createImageBitmap(floorImage));
                }),
                
                new Promise<ImageBitmap[]>(async (resolve) => {
                    const { wall, doorMask } = await wallRenderer.renderOffScreen();

                    resolve([
                        await createImageBitmap(wall),
                        await createImageBitmap(doorMask)
                    ]);
                })
            ]);

            const context = canvasRef.current?.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.translate(width / 2, (wallRenderer.depth + 3.5) * fullSize);

            context.drawImage(wallImage, -(wallRenderer.rows * fullSize), -((wallRenderer.depth + 3.5) * fullSize) - wallRenderer.structure.wall.thickness);
            context.drawImage(floorImage, -(floorRenderer.rows * fullSize), -(floorRenderer.depth * halfSize) - halfSize - (floorRenderer.structure.wall.thickness ?? 0));
            context.drawImage(doorMaskImage, -(wallRenderer.rows * fullSize), -((wallRenderer.depth + 3.5) * fullSize) - wallRenderer.structure.wall.thickness);
        })();
    }, [ canvasRef, structure ]);

    return (
        <canvas ref={canvasRef} width={width} height={height} style={style}/>
    );
}
