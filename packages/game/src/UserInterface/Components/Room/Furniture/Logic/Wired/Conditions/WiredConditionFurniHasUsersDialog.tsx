import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import WiredFurniturePicker from "@UserInterface/Common/Dialog/Layouts/Wired/WiredFurniturePicker";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";

export default function WiredConditionFurniHasUsersDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const room = useRoomInstance();

    const [requireAllFurni, setRequireAllFurni] = useState(data.data.data?.wiredConditionFurniHasUsers?.requireAllFurni ?? false);
    const [furnitureIds, setFurnitureIds] = useState(data.data.data?.common?.furnitureSelection?.furnitureIds ?? []);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    furnitureSelection: {
                        furnitureIds
                    }
                },

                wiredConditionFurniHasUsers: {
                    requireAllFurni
                }
            }
        }));

        onClose();
    }, [requireAllFurni, furnitureIds, room, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Allow trigger if:</b>

                <WiredRadio value={requireAllFurni} onChange={setRequireAllFurni} items={[
                    {
                        value: false,
                        label: "If one of the selected furni has an avatar on it"
                    },

                    {
                        value: true,
                        label: "If all of the selected furni have avatars on them"
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>
            
            <WiredFurniturePicker value={furnitureIds} onChange={setFurnitureIds} maxFurniture={20}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
