import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import useUserProfile from "@UserInterface/Components/Users/Hooks/useUserProfile";
import FurnitureGift from "@UserInterface/Components/Furniture/FurnitureGift";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useUser } from "@UserInterface/Hooks/useUser";
import { useCallback } from "react";
import { webSocketClient } from "@Game/index";
import { UseRoomFurnitureData } from "@pixel63/events";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

export default function RoomFurnitureGiftDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("room");
    const user = useUser();
    const userProfile = useUserProfile(data.data.data?.gift?.senderUserId);
    const room = useRoomInstance();

    const handleOpen = useCallback(() => {
        room?.websocket.sendProtobuff(UseRoomFurnitureData, UseRoomFurnitureData.create({
            id: data.data.id
        }));

        onClose();
    }, [data, onClose, room]);

    if(hidden || !userProfile) {
        return null;
    }

    return (
        <Dialog title={getTranslation("furniture.gift.title", { name: userProfile.name })} hidden={hidden} onClose={onClose} width={340} assumedHeight={220} height={"auto"} initialPosition="center">
            <DialogContent style={{ gap: 10 }}>
                <FlexLayout flex={1} align="center" justify="center">
                    <FurnitureGift name={userProfile.name} figureConfiguration={userProfile.figureConfiguration} message={data.data.data?.gift?.message}/>
                </FlexLayout>

                {(data.data.userId === user.id) && (
                    <FlexLayout direction="row">
                        <div style={{ flex: 1 }}/>

                        <DialogButton color="green" onClick={handleOpen}>{getTranslation("furniture.gift.open")}</DialogButton>
                    </FlexLayout>
                )}
            </DialogContent>
        </Dialog>
    );
}
