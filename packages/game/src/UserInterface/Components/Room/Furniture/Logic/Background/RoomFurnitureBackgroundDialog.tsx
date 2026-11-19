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
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

export type RoomFurnitureBackgroundDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_background";
};

export default function RoomFurnitureBackgroundDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();

    const [imageUrl, setImageUrl] = useState(data.data.data?.background?.imageUrl ?? "");
    const [linkUrl, setLinkUrl] = useState(data.data.data?.background?.linkUrl ?? "");
    
    const [offsetX, setOffsetX] = useState(data.data.data?.background?.left ?? 0);
    const [offsetY, setOffsetY] = useState(data.data.data?.background?.top ?? 0);
    const [offsetZ, setOffsetZ] = useState(data.data.data?.background?.index ?? 0);

    const [relativePosition, setRelativePosition] = useState(data.data.data?.background?.relativePosition ?? true);

    const handleApply = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.fromJSON({
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
    }, [data, imageUrl, linkUrl, offsetX, offsetY, offsetZ, relativePosition, room]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title={getTranslation("furniture.background.title")} hidden={hidden} onClose={onClose} width={300} assumedHeight={400} height={"auto"} initialPosition="center">
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
                        <div style={{
                            display: "flex",
                            
                            justifyContent: "center",
                            alignItems: "center",

                            height: 180
                        }}>
                            <img src={imageUrl} style={{
                                maxHeight: 180,
                                objectFit: "contain"
                            }}/>
                        </div>
                    )}

                    <b>{getTranslation("furniture.background.image_url")}</b>

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
                            <b>{getTranslation("furniture.background.offset_x")}</b>

                            <Input type="number" placeholder="0" value={offsetX.toString()} onChange={(value) => setOffsetX(parseInt(value))} style={{ width: 0 }}/>
                        </div>
                        
                        <div style={{
                            flex: 1,
                            
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        }}>
                            <b>{getTranslation("furniture.background.offset_y")}</b>

                            <Input type="number" placeholder="0" value={offsetY.toString()} onChange={(value) => setOffsetY(parseInt(value))} style={{ width: 0 }}/>
                        </div>
                        
                        <div style={{
                            flex: 1,
                            
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        }}>
                            <b>{getTranslation("furniture.background.offset_z")}</b>

                            <Input type="number" placeholder="0" value={offsetZ.toString()} onChange={(value) => setOffsetZ(parseInt(value))} style={{ width: 0 }}/>
                        </div>
                    </div>

                    <Checkbox value={relativePosition} onChange={setRelativePosition} label={getTranslation("furniture.background.relative")}/>

                    <div/>

                    <b>{getTranslation("furniture.background.link_url")}</b>
                    
                    <p>{getTranslation("furniture.background.link_hint")}</p>

                    <Input placeholder="https://..." value={linkUrl} onChange={setLinkUrl}/>
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <DialogButton onClick={handleApply}>{getTranslation("furniture.background.apply")}</DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
