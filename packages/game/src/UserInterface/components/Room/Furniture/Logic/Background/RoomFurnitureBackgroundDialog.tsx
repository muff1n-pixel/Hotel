import { useCallback, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import { SetFurnitureDataEventData } from "@Shared/Communications/Requests/Rooms/Furniture/SetFurnitureDataEventData";
import { RoomFurnitureBackgroundData } from "@Shared/Interfaces/Room/Furniture/RoomFurnitureBackgroundData";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../Dialog/Dialog";
import DialogContent from "../../../../Dialog/DialogContent";
import DialogButton from "../../../../Dialog/Button/DialogButton";
import Input from "../../../../Form/Input";

export type RoomFurnitureBackgroundDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_background";
};

export default function RoomFurnitureBackgroundDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [imageUrl, setImageUrl] = useState((data.furniture.data.data as RoomFurnitureBackgroundData)?.imageUrl);
    
    const [offsetX, setOffsetX] = useState((data.furniture.data.data as RoomFurnitureBackgroundData)?.position?.x ?? 0);
    const [offsetY, setOffsetY] = useState((data.furniture.data.data as RoomFurnitureBackgroundData)?.position?.y ?? 0);
    const [offsetZ, setOffsetZ] = useState((data.furniture.data.data as RoomFurnitureBackgroundData)?.position?.z ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.send<SetFurnitureDataEventData<RoomFurnitureBackgroundData>>("SetFurnitureDataEvent", {
            furnitureId: data.furniture.data.id,
            data: {
                imageUrl,
                position: {
                    x: offsetX,
                    y: offsetY,
                    z: offsetZ
                }
            }
        });
    }, [data, imageUrl, offsetX, offsetY, offsetZ]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title="Room Furniture Background" hidden={hidden} onClose={onClose} width={300} height={400} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                    
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    {(imageUrl) && (
                        <img src={imageUrl} style={{
                            maxHeight: 180,
                            objectFit: "contain"
                        }}/>
                    )}

                    <b>Image url</b>

                    <Input placeholder="/room/backgrounds/..." value={imageUrl} onChange={setImageUrl}/>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 8
                    }}>
                        <div style={{
                            flex: 1,
                            
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        }}>
                            <b>Offset X</b>

                            <Input type="number" placeholder="0" value={offsetX.toString()} onChange={(value) => setOffsetX(parseInt(value))} style={{ width: 0 }}/>
                        </div>
                        
                        <div style={{
                            flex: 1,
                            
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        }}>
                            <b>Offset Y</b>

                            <Input type="number" placeholder="0" value={offsetY.toString()} onChange={(value) => setOffsetY(parseInt(value))} style={{ width: 0 }}/>
                        </div>
                        
                        <div style={{
                            flex: 1,
                            
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        }}>
                            <b>Offset Z</b>

                            <Input type="number" placeholder="0" value={offsetZ.toString()} onChange={(value) => setOffsetZ(parseInt(value))} style={{ width: 0 }}/>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <DialogButton onClick={handleApply}>Apply</DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
