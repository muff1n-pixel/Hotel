import { useEffect, useRef } from "react";
import useDialogMovement from "../../../../Dialog/Hooks/useDialogMovement";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { useRoomInstance } from "../../../../../hooks/useRoomInstance";

export type RoomFurnitureTrophyDialogData = {
    furniture: RoomInstanceFurniture;
    type: "trophy";
};

export default function RoomFurnitureTrophyDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { elementRef, onDialogFocus, onMouseDown } = useDialogMovement();

    useEffect(() => {
        if(!room) {
            return;
        }

        if(!canvasRef.current) {
            return;
        }

        const imageName = ["silver", "gold", "silver", "bronze"][data.item.furnitureRenderer.color ?? 0];

        AssetFetcher.fetchImage(`/assets/trophies/${imageName}.png`).then((image) => {
            const context = canvasRef.current?.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.canvas.width = image.width;
            context.canvas.height = image.height;

            context.drawImage(image, 0, 0);
        });
    }, [room, canvasRef, data]);

    return (
        <div ref={elementRef} onMouseDown={onDialogFocus} style={{
            position: "fixed",
            pointerEvents: "auto",
            width: 340,
            height: 180
        }}>
            <div style={{
                position: "absolute",

                left: 0,
                top: 0
            }}>
                <canvas ref={canvasRef}/>
            </div>

            <div style={{
                position: "absolute",
                
                left: 0,
                top: 0,

                height: 25,
                width: "100%",

                display: "flex",
                alignItems: "center",

                paddingLeft: 10,
                paddingBottom: 2,

                boxSizing: "border-box"
            }} onMouseDown={onMouseDown}>
                <div style={{
                    position: "absolute",

                    top: 6,
                    right: 7,

                    width: 13,
                    height: 14,

                    cursor: "pointer"
                }} onClick={onClose}/>
            </div>

            <div style={{
                position: "absolute",

                width: 330,
                height: 120,

                left: 5,
                top: 20,

                padding: "6px",
                boxSizing: "border-box",

                display: "flex",
            }}>
                <textarea readOnly={!room?.hasRights} value={data.data.data?.trophy?.engraving} style={{
                    flex: 1,

                    outline: "none",
                    background: "transparent",
                    margin: 0,
                    border: 0,
                    padding: 0,
                    fontFamily: "Ubuntu",
                    fontSize: 12,
                    resize: "none"
                }}/>
            </div>

            <div style={{
                position: "absolute",

                left: 2,
                right: 2,
                bottom: 14,

                padding: "6px 20px",
                boxSizing: "border-box",

                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",

                color: "black",
                fontSize: 12,
                fontFamily: "Ubuntu Bold"
            }}>
                <div>{data.data.data?.trophy?.date}</div>
                <div>{data.data.data?.trophy?.author}</div>
            </div>
        </div>
    );
}
