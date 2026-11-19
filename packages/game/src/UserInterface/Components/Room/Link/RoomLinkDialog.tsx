import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import RoomThumbnail from "../Thumbnail/RoomThumbnail";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type RoomLinkDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomLinkDialog({ hidden, onClose }: RoomLinkDialogProps) {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();

    const url = useMemo(() => {
        const url = new URL(window.location.href);

        url.searchParams.forEach((_, key) => url.searchParams.delete(key));

        if(room) {
            url.searchParams.set("room", room?.id);
        }

        return url.toString();
    }, [room]);

    if(!room) {
        return null;
    }

    return (
        <Dialog title={getTranslation("link.title")} hidden={hidden} onClose={onClose} initialPosition="center" width={450} height={"auto"} assumedHeight={170}>
            <DialogContent>
                <FlexLayout direction="row">
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <RoomThumbnail roomId={room.id} thumbnail={room.information?.thumbnail}/>
                    </div>

                    <FlexLayout>
                        <b>{getTranslation("link.share")}</b>

                        <p>{getTranslation("link.description")}</p>

                        <Input readonly value={url}/>
                    </FlexLayout>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
