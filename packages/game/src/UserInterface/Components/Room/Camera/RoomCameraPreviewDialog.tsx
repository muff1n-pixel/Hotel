import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import RoomCameraEditorRenderer from "@UserInterface/Components/Room/Camera/RoomCameraEditorRenderer";
import { RoomCameraOptions } from "@UserInterface/Components/Room/Camera/RoomCameraEditorDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import { FurnitureData, PurchaseRoomCameraPhotoData } from "@pixel63/events";
import { useRef, useState } from "react";
import { clientInstance, webSocketClient } from "@Game/index";
import { useUser } from "@UserInterface/Hooks/useUser";

export type RoomCameraPreviewDialogProps = {
    data: {
        image: string;
        options: RoomCameraOptions;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomCameraPreviewDialog({ data, hidden, onClose }: RoomCameraPreviewDialogProps) {
    const user = useUser();

    const [dataUrl, setDataUrl] = useState<string>();

    if(!data) {
        return null;
    }

    return (
        <Dialog title="Room Camera Preview" hidden={hidden} onClose={onClose} width={346} height={"auto"} assumedHeight={580}>
            <DialogContent style={{
                gap: 10
            }}>
                <div style={{
                    border: "1px solid #000000",
                    width: 320,
                    height: 320,

                    position: "relative"
                }}>
                    <RoomCameraEditorRenderer onDataUrlChanged={setDataUrl} image={data.image} options={data.options} size={320}/>
                </div>

                <FlexLayout direction="row" justify="space-between" style={{
                    background: "#C6C5BE",
                    borderRadius: 5,
                    padding: 10
                }}>
                    <FlexLayout align="center" justify="center" flex={1}>
                        <FurnitureImage externalImage={dataUrl} furnitureData={FurnitureData.create({ type: "external_image_wallitem_poster" })}/>
                    </FlexLayout>

                    <FlexLayout gap={5} flex={3}>
                        <b>Buy large photo poster furni</b>
                        
                        <div>Your best shots from the hotel.</div>

                        <FlexLayout direction="row" align="center" gap={5}>Price: <FlexLayout direction="row" align="center" gap={2}><div className="sprite_currencies_credits"/><b>5</b></FlexLayout></FlexLayout>
                    </FlexLayout>

                    <DialogButton disabled={user.credits < 3} color="green" style={{
                        flex: 1,

                        alignSelf: "flex-end",
                        justifySelf: "flex-end",
                    }} onClick={(event) => {
                        webSocketClient.sendProtobuff(PurchaseRoomCameraPhotoData, PurchaseRoomCameraPhotoData.create({
                            action: "regular",
                            image: dataUrl
                        }));
                        
                        clientInstance.flyingFurnitureIcons.value!.push({
                            id: Math.random().toString(),
                            furniture: FurnitureData.create({ type: "external_image_wallitem_poster" }),
                            position: (event?.target as HTMLDivElement).getBoundingClientRect(),
                            targetElementId: "toolbar-inventory"
                        });

                        clientInstance.flyingFurnitureIcons.update();
                    }}>
                        Buy
                    </DialogButton>
                </FlexLayout>

                <FlexLayout direction="row" justify="space-between" style={{
                    background: "#C6C5BE",
                    borderRadius: 5,
                    padding: 10
                }}>
                    <FlexLayout align="center" justify="center" flex={1}>
                        <FurnitureImage externalImage={dataUrl} furnitureData={FurnitureData.create({ type: "external_image_wallitem_poster_small", interactionType: "external_image" })}/>
                    </FlexLayout>

                    <FlexLayout gap={5} flex={3}>
                        <b>Buy photo poster furni</b>
                        
                        <div>Your best shots from the hotel.</div>

                        <FlexLayout direction="row" align="center" gap={5}>Price: <FlexLayout direction="row" align="center" gap={2}><div className="sprite_currencies_credits"/><b>2</b></FlexLayout></FlexLayout>
                    </FlexLayout>

                    <DialogButton disabled={user.credits < 5} color="green" style={{
                        flex: 1,

                        alignSelf: "flex-end",
                        justifySelf: "flex-end",
                    }} onClick={(event) => {
                        webSocketClient.sendProtobuff(PurchaseRoomCameraPhotoData, PurchaseRoomCameraPhotoData.create({
                            action: "small",
                            image: dataUrl
                        }));
                        
                        clientInstance.flyingFurnitureIcons.value!.push({
                            id: Math.random().toString(),
                            furniture: FurnitureData.create({ type: "external_image_wallitem_poster_small" }),
                            position: (event?.target as HTMLDivElement).getBoundingClientRect(),
                            targetElementId: "toolbar-inventory"
                        });

                        clientInstance.flyingFurnitureIcons.update();
                    }}>
                        Buy
                    </DialogButton>
                </FlexLayout>
                

                {/*<FlexLayout direction="row" justify="space-between" style={{
                    background: "#C6C5BE",
                    borderRadius: 5,
                    padding: 10
                }}>
                    <FlexLayout gap={5} flex={5}>
                        <b>Publish on web</b>
                        <div>Post the photo on your profile page and the Photos page.</div>
                        <FlexLayout direction="row" align="center" gap={5}>Price: <FlexLayout direction="row" align="center" gap={2}><div className="sprite_currencies_duckets"/><b>10</b></FlexLayout></FlexLayout>
                    </FlexLayout>

                    <DialogButton color="green" style={{
                        alignSelf: "flex-end",
                        justifySelf: "flex-end",

                        flex: 2
                    }}>
                        Publish
                    </DialogButton>
                </FlexLayout>*/}

                <div style={{ flex: 1 }}/>

                <DialogButton style={{ alignSelf: "flex-start"}} onClick={onClose}>Cancel</DialogButton>
            </DialogContent>
        </Dialog>
    );
}
