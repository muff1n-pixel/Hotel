import { useEffect, useState } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { clientInstance, webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import Input from "../../../../../Common/Form/Components/Input";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import FurnitureImage from "@UserInterface/Components2/Furniture/FurnitureImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogSlider from "@UserInterface/Common/Dialog/Components/Slider/DialogSlider";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";

export type RoomFurnitureStackHelperDialogData = {
    furniture: RoomInstanceFurniture;
    type: "stack_helper";
};

export default function RoomFurnitureStackHelperDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [height, setHeight] = useState(data.data.data?.stackHelper?.height ?? data.item.position?.depth ?? 0);
    const [copyDepthFromFurniture, setCopyDepthFromFurniture] = useState(false);

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
        }, 100);

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

    useEffect(() => {
        if(!copyDepthFromFurniture || !room) {
            return;
        }

        if(!room.roomRenderer.cursor) {
            return;
        }

        let currentHoveredItem: RoomFurnitureItem | null = null;

        function resetPreviousHoveredItem() {
            if(!currentHoveredItem) {
                return;
            }

            currentHoveredItem.furnitureRenderer.grayscaled = undefined;
            currentHoveredItem = null;
        }

        const unsubscribeHoveredItem = room.roomRenderer.hoveredItem.subscribe((hoveredItem?: RoomItem | null) => {
            resetPreviousHoveredItem();

            if(!hoveredItem) {
                return;
            }

            if(!(hoveredItem instanceof RoomFurnitureItem)) {
                return;
            }

            if(hoveredItem.id === data.item.id) {
                return;
            }

            currentHoveredItem = hoveredItem;

            currentHoveredItem.furnitureRenderer.grayscaled = {
                foreground: "#785000",
                background: "#F6C666"
            };
        });

        const unsubscribeFocusedItem = room.roomRenderer.focusedItem.subscribe((focusedItem?: RoomItem | null) => {
            if(!focusedItem) {
                return;
            }

            if(!(focusedItem instanceof RoomFurnitureItem)) {
                return;
            }

            if(focusedItem.id !== currentHoveredItem?.id) {
                return;
            }

            if(!focusedItem.position) {
                return;
            }

            setHeight(focusedItem.position.depth)
            setCopyDepthFromFurniture(false);
        });

        return () => {
            unsubscribeHoveredItem();
            unsubscribeFocusedItem();
            resetPreviousHoveredItem();
        };
    }, [copyDepthFromFurniture, room]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title="Stacking Helper" hidden={hidden} onClose={onClose} width={360} assumedHeight={180} height="auto" initialPosition="center" onClick={() => {
            if(clientInstance.roomInstance.value) {
                clientInstance.roomInstance.value.roomRenderer.focusedItem.value = data.item;
            }
        }}>
            <DialogContent style={{ flex: 1, gap: 20 }}>
                <FlexLayout gap={20} direction="row" align="center">
                    <FurnitureImage furnitureData={data.furnitureData}/>

                    <div>
                        <b>{data.furnitureData.name}</b>
                        <p>{data.furnitureData.description}</p>
                    </div>
                </FlexLayout>

                <FlexLayout gap={10} direction="column">
                    <FlexLayout direction="row">
                        <FlexLayout flex={1} align="center" justify="center">
                            <DialogSlider value={height} onChange={setHeight} step={0.2} max={32} min={0}/>
                        </FlexLayout>

                        <FlexLayout flex={1} direction="row" align="center" justify="center">
                            <div style={{ color: "#6A6A69" }}>Height:</div>

                            <Input style={{ width: 40 }} type="number" value={height.toString()} onChange={(value) => setHeight(window.isNaN(parseFloat(value))?(0):(parseFloat(value)))}/>
                        </FlexLayout>
                    </FlexLayout>

                    <DialogLink onClick={() => setCopyDepthFromFurniture(!copyDepthFromFurniture)}>
                        {(copyDepthFromFurniture)?(
                            "Stop copying depth from furniture"
                        ):(
                            "Copy depth from furniture"
                        )}
                    </DialogLink>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
