import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";
import RoomItemsCameraRenderer from "@UserInterface/Components/Room/Camera/RoomItemsCameraRenderer";
import { useCallback, useRef } from "react";
import RoomRenderer from "@Client/Room/RoomRenderer";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useRoomInstance } from "@UserInterface/Hooks2/useRoomInstance";
import { ShopFeatureRoomConfigurationData } from "@pixel63/events";

export type EditShopFeatureDialogProps = {
    id: string;
    hidden?: boolean;
    data: {
        alignment: "vertical" | "top" | "middle" | "bottom";
        onClose: (data: ShopFeatureRoomConfigurationData) => void;
        onCancel: () => void;
    };
    onClose?: () => void;
}

export default function EditShopFeatureCameraDialog({ hidden, data, onClose }: EditShopFeatureDialogProps) {
    const room = useRoomInstance();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleClick = useCallback(() => {
        if(!room) {
            return;
        }

        if(!canvasRef.current) {
            return;
        }

        const clientRectangle = canvasRef.current?.getBoundingClientRect();

        if(!clientRectangle) {
            throw new Error("Bounding client rectangle is not available.");
        }

        const minimumLeft = Math.floor(clientRectangle.left);
        const minimumTop = Math.floor(clientRectangle.top);

        const result = room.roomRenderer.captureItems(canvasRef.current, canvasRef.current.width, canvasRef.current.height);

        result.renderedOffsetLeft -= minimumLeft;
        result.renderedOffsetTop -= minimumTop;

        data.onClose(result);
        onClose?.();
    }, [room, data, canvasRef, onClose]);

    return (
        <Dialog title={"Shop Feature Room Camera"} hidden={hidden} onClose={() => {
            data.onCancel();
            onClose?.();
        }} initialPosition="center" width={(data.alignment === "vertical")?(200):(380)} height="auto" assumedHeight={420}>
            <DialogContent>
                <FlexLayout direction="column">
                    <RoomItemsCameraRenderer canvasRef={canvasRef} width={(data.alignment === "vertical")?(184):(365)} height={(data.alignment === "vertical")?(497):(126)}/>

                    <div style={{ alignSelf: "flex-end" }}>
                        <DialogButton onClick={handleClick}>Capture</DialogButton>
                    </div>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
