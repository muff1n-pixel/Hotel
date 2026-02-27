import { CSSProperties, useEffect, useRef } from "react";
import { RoomStructure } from "@Shared/Interfaces/Room/RoomStructure";
import FloorRenderer from "@Client/Room/Structure/FloorRenderer";
import WallRenderer from "@Client/Room/Structure/WallRenderer";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export type RoomMapImageProps = {
    crop?: boolean;
    width: number;
    height: number;
    structure: RoomStructure;
    style: CSSProperties;
    leftWallColor?: string[];
}

export default function RoomMapImage({ crop = false, width, height, style, structure, leftWallColor }: RoomMapImageProps) {
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
                (async () => {
                    const floorImage = await floorRenderer.renderOffScreen();

                    return floorImage;
                })(),
                
                (async () => {
                    const { wall, doorMask } = await wallRenderer.renderOffScreen(leftWallColor);

                    return [
                        wall,
                        doorMask
                    ];
                })()
            ]);

            const canvas = new OffscreenCanvas(Math.max(wallImage.width, floorImage.width), Math.max(wallImage.height, floorImage.height));

            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.translate((floorRenderer.rows * fullSize), (wallRenderer.depth + 3.5) * fullSize);

            context.drawImage(wallImage, -(wallRenderer.rows * fullSize), -((wallRenderer.depth + 3.5) * fullSize) - wallRenderer.structure.wall.thickness);
            context.drawImage(floorImage, -(floorRenderer.rows * fullSize), -(floorRenderer.depth * fullSize) - fullSize - (floorRenderer.structure.wall.thickness ?? 0));
            context.drawImage(doorMaskImage, -(wallRenderer.rows * fullSize), -((wallRenderer.depth + 3.5) * fullSize) - wallRenderer.structure.wall.thickness);

            const resultContext = canvasRef.current?.getContext("2d");

            if(!resultContext) {
                throw new ContextNotAvailableError();
            }

            if(crop) {
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                const bounds = { top: height, left: width, right: 0, bottom: 0 };

                for (let row = 0; row < imageData.height; row++) {
                    for (let column = 0; column < imageData.width; column++) {
                        if (imageData.data[row * width * 4 + column * 4 + 3] !== 0) {
                            if (row < bounds.top) {
                                bounds.top = row;
                            }

                            if (column < bounds.left) {
                                bounds.left = column;
                            } 

                            if (column > bounds.right) {
                                bounds.right = column;
                            }

                            if (row > bounds.bottom) {
                                bounds.bottom = row
                            }
                        }
                    }
                }

                const newWidth = bounds.right - bounds.left
                const newHeight = bounds.bottom - bounds.top

                resultContext.canvas.width = newWidth;
                resultContext.canvas.height = newHeight;

                resultContext.drawImage(canvas,
                    bounds.left, bounds.top, newWidth, newHeight,
                    0, 0, newWidth, newHeight
                );
            }
            else {
                resultContext.canvas.width = width;
                resultContext.canvas.height = height;

                resultContext.drawImage(canvas, 0, 0);
            }
        })();
    }, [ canvasRef, structure ]);

    return (
        <canvas ref={canvasRef} style={style}/>
    );
}
