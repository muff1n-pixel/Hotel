import { Fragment, RefObject, useEffect, useState } from "react";
import { useRoomInstance } from "../../../Hooks2/useRoomInstance";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomRenderer from "@Client/Room/RoomRenderer";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureSprite from "@Client/Room/Items/Furniture/RoomFurnitureSprite";
import ShopFeatureImage from "@Client/Images/ShopFeatureImage";

export type RoomItemsCameraRendererProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    width: number;
    height: number;
}

export default function RoomItemsCameraRenderer({ canvasRef, width, height }: RoomItemsCameraRendererProps) {
    const room = useRoomInstance();

    useEffect(() => {
        if(!room || !canvasRef.current) {
            return;
        }
        
        const listener = async () => {
            const context = canvasRef.current?.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.canvas.width = width;
            context.canvas.height = height;

            context.fillStyle = "#CCCCCC";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            const clientRectangle = canvasRef.current?.getBoundingClientRect();

            if(!clientRectangle) {
                throw new Error("Bounding client rectangle is not available.");
            }

            const minimumLeft = Math.floor(clientRectangle.left);
            const minimumTop = Math.floor(clientRectangle.top);

            const result = room.roomRenderer.captureItems(canvasRef.current!, width, height);

            result.renderedOffsetLeft -= minimumLeft;
            result.renderedOffsetTop -= minimumTop;

            await ShopFeatureImage.renderRoom(context, result);
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
