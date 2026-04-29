import { RefObject, useEffect } from "react";
import { useRoomInstance } from "../../../Hooks2/useRoomInstance";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";

export type RoomCameraRendererProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    width: number;
    height: number;
}

export default function RoomCameraRenderer({ canvasRef, width, height }: RoomCameraRendererProps) {
    const room = useRoomInstance();

    useEffect(() => {
        if(!room || !canvasRef.current) {
            return;
        }
        
        const listener = () => {
            const context = canvasRef.current?.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            const image = room.roomRenderer.captureCroppedImage(canvasRef.current!, width, height);

            context.drawImage(image, 0, 0);
        };

        room.roomRenderer.addEventListener("render", listener);

        return () => {
            room.roomRenderer.removeEventListener("render", listener);
        };
    }, [room, canvasRef]);

    return (
        <canvas ref={canvasRef} width={width} height={height}/>
    );
}
