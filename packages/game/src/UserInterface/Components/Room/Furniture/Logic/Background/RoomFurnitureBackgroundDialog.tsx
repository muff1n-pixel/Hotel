import { useCallback, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../../../Common/Dialog/Components/Button/DialogButton";
import Input from "../../../../../Common/Form/Components/Input";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";

export type RoomFurnitureBackgroundDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_background";
};

export default function RoomFurnitureBackgroundDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [imageUrl, setImageUrl] = useState(data.data.data?.background?.imageUrl ?? "");
    const [linkUrl, setLinkUrl] = useState(data.data.data?.background?.linkUrl ?? "");
    
    const [offsetX, setOffsetX] = useState(data.data.data?.background?.left ?? 0);
    const [offsetY, setOffsetY] = useState(data.data.data?.background?.top ?? 0);
    const [offsetZ, setOffsetZ] = useState(data.data.data?.background?.index ?? 0);

    const [relativePosition, setRelativePosition] = useState(data.data.data?.background?.relativePosition ?? true);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.fromJSON({
            id: data.data.id,

            data: {
                background: {
                    imageUrl,
                    linkUrl,

                    left: offsetX,
                    top: offsetY,

                    index: offsetZ,

                    relativePosition
                }
            }
        }));
    }, [data, imageUrl, linkUrl, offsetX, offsetY, offsetZ, relativePosition]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title="Room Furniture Background" hidden={hidden} onClose={onClose} width={300} assumedHeight={400} height={"auto"} initialPosition="center">
            <DialogContent style={{
                gap: 10
            }}>
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

                    <Checkbox value={relativePosition} onChange={setRelativePosition} label="Put image relative to furniture sprite"/>

                    <div/>

                    <b>Link url</b>
                    
                    <p>This is only available for background furniture that has clickable sprites.</p>

                    <Input placeholder="https://..." value={linkUrl} onChange={setLinkUrl}/>
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
