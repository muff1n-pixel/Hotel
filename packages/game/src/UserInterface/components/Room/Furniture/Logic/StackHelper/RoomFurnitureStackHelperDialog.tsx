import { useCallback, useEffect, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import Input from "../../../../../Common/Form/Components/Input";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogSlider from "@UserInterface/Common/Dialog/Components/Slider/DialogSlider";

export type RoomFurnitureStackHelperDialogData = {
    furniture: RoomInstanceFurniture;
    type: "stack_helper";
};

export default function RoomFurnitureStackHelperDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const [height, setHeight] = useState(data.data.data?.stackHelper?.height ?? data.data.position?.depth ?? 0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.fromJSON({
                id: data.data.id,

                data: {
                    stackHelper: {
                        height
                    }
                }
            }));
        }, 200);

        return () => {
            clearTimeout(timeout);
        };
    }, [height]);

    useEffect(() => {
        if(data.furniture.animation === 1) {
            return;
        }
        
        data.furniture.animation = 1;

        return () => {
            data.furniture.animation = 0;
        };
    }, [data.furniture.animation]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title="Stacking Helper" hidden={hidden} onClose={onClose} width={360} height={180} initialPosition="center">
            <DialogContent style={{ flex: 1, gap: 20 }}>
                <FlexLayout gap={20} direction="row" align="center">
                    <FurnitureImage furnitureData={data.furnitureData}/>

                    <div>
                        <b>{data.furnitureData.name}</b>
                        <p>{data.furnitureData.description}</p>
                    </div>
                </FlexLayout>

                <FlexLayout direction="row">
                    <FlexLayout flex={1} align="center" justify="center">
                        <DialogSlider value={height} onChange={setHeight} step={0.2} max={32} min={0}/>
                    </FlexLayout>

                    <FlexLayout flex={1} direction="row" align="center" justify="center">
                        <div style={{ color: "#6A6A69" }}>Height:</div>

                        <Input style={{ width: 40 }} type="number" value={height.toString()} onChange={(value) => setHeight(window.isNaN(parseFloat(value))?(0):(parseFloat(value)))}/>
                    </FlexLayout>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
