import { useCallback } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../../../Common/Dialog/Components/Button/DialogButton";
import { UseRoomFurnitureData } from "@pixel63/events";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export type RoomFurnitureClothingDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_clothing";
};

export default function RoomFurnitureClothingDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const handleBind = useCallback(() => {
        onClose?.();

        webSocketClient.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.fromJSON({
            id: data.data.id,
        }));
    }, [data, onClose]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title={data.furnitureData.name} hidden={hidden} onClose={onClose} initialPosition="center" width={420} height={"auto"} assumedHeight={270}>
            <DialogHeaderContent header={{
                backgroundColor: "#8899A2",

                icon: (
                    <FlexLayout justify="center" align="center" style={{
                        minWidth: 90,
                        minHeight: 90
                    }}>
                        <FurnitureImage furnitureData={data.furnitureData}/>
                    </FlexLayout>
                ),

                title: data.furnitureData.name,
                description: (
                    <div>
                        {(data.furnitureData.description) && (
                            <p>{data.furnitureData.description}</p>
                        )}

                        <p style={{ marginTop: 20 }}><i>This is a permanent action. Once you add it to wardrobe, the furniture will disappear forever.</i></p>
                    </div>
                )
            }}/>

            <DialogContent style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <DialogLink onClick={onClose}>
                    Cancel
                </DialogLink>

                <DialogButton onClick={handleBind}>
                    Add to wardrobe
                </DialogButton>
            </DialogContent>
        </Dialog>
    );
}
