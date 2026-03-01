import { useCallback, useEffect, useRef, useState } from "react";
import useDialogMovement from "../../../../Dialog/Hooks/useDialogMovement";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import { useRoomInstance } from "../../../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type RoomFurnitureStickiesDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_stickie";
};

export default function RoomFurnitureStickiesDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { elementRef, onDialogFocus, onMouseDown } = useDialogMovement();

    const [text, setText] = useState<string>(data.data.data?.sticky?.text ?? "");
    const [colorId, setColorId] = useState<number>(data.item.furnitureRenderer.color ?? 0);
    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        if(!room) {
            return;
        }

        if(!canvasRef.current) {
            return;
        }

        const color = data.item.furnitureRenderer.getColor(colorId) ?? undefined;

        AssetFetcher.fetchImageSprite("/assets/stickies/blanco.png", {
            x: 0,
            y: 0,
            color,
            ignoreImageData: true
        }).then(({ image }) => {
            const context = canvasRef.current?.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            context.canvas.width = image.width;
            context.canvas.height = image.height;

            context.drawImage(image, 0, 0);

            context.fillStyle = "red";
            context.globalCompositeOperation = "multiply";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.globalCompositeOperation = "source-in";
            context.drawImage(image, 0, 0);
        });

        setColors(data.item.furnitureRenderer.getColors());
    }, [room, canvasRef, data, colorId]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(text !== data.data.data?.sticky?.text) {
                webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
                    id: data.data.id,

                    data: {
                        sticky: {
                            text
                        }
                    }
                }));
            }
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [text]);

    const handleColor = useCallback((color: number) => {
        setColorId(color + 1);

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,
            color: color + 1
        }));
    }, [data]);

    return (
        <div ref={elementRef} onMouseDown={onDialogFocus} style={{
            position: "fixed",
            pointerEvents: "auto",
            width: 185,
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
                {(room?.hasRights) && (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 3
                    }}>
                        {colors.map((color, index) => (
                            <div key={color} onClick={() => handleColor(index)} style={{
                                width: 10,
                                height: 10,

                                boxSizing: "border-box",

                                backgroundColor: `#${color}`,

                                cursor: "pointer",

                                border: "1px solid #000000",
                                borderRadius: 1
                            }}/>
                        ))}
                    </div>
                )}

                <div className="sprite_stickies_close" style={{
                    position: "absolute",

                    top: 7,
                    right: 13,

                    cursor: "pointer"
                }} onClick={onClose}/>
            </div>

            <div style={{
                position: "absolute",

                width: 175,
                height: 140,

                left: 5,
                top: 20,

                padding: "6px",
                boxSizing: "border-box",

                display: "flex",
            }}>
                <textarea readOnly={!room?.hasRights} value={text} onChange={(event) => setText((event.target as HTMLTextAreaElement).value)} style={{
                    flex: 1,

                    outline: "none",
                    background: "transparent",
                    margin: 0,
                    border: 0,
                    padding: 0,
                    fontFamily: "Ubuntu",
                    fontSize: 12,
                    resize: "none"
                }} maxLength={250}/>
            </div>
        </div>
    );
}
