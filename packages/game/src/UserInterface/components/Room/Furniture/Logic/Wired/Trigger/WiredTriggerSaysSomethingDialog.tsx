import WiredDialog from "../../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../../Dialog/Wired/WiredSection";
import WiredInput from "../../../../../Dialog/Wired/WiredInput";
import { useCallback, useState } from "react";
import WiredRadio from "../../../../../Dialog/Wired/WiredRadio";
import WiredCheckbox from "../../../../../Dialog/Wired/WiredCheckbox";
import WiredButton from "../../../../../Dialog/Wired/WiredButton";
import { WiredTriggerUserSaysSomethingData } from "@Shared/Interfaces/Room/Furniture/Wired/Trigger/WiredTriggerUserSaysSomethingData";
import { webSocketClient } from "../../../../../../..";
import { SetFurnitureDataEventData } from "@Shared/Communications/Requests/Rooms/Furniture/SetFurnitureDataEventData";

export type WiredTriggerSaysSomethingDialogData = {
    furniture: RoomInstanceFurniture<WiredTriggerUserSaysSomethingData>;
    type: "wf_trg_says_something";
};

export default function WiredTriggerSaysSomethingDialog({ data, onClose }: RoomFurnitureLogicDialogProps<WiredTriggerSaysSomethingDialogData>) {
    const [type, setType] = useState(data.furniture.data.data?.type ?? "match");
    const [message, setMessage] = useState(data.furniture.data.data?.message ?? "");
    const [hideMessage, setHideMessage] = useState(data.furniture.data.data?.hideMessage ?? true);
    const [onlyRoomOwner, setOnlyRoomOwner] = useState(data.furniture.data.data?.onlyRoomOwner ?? false);

    const handleApply = useCallback(() => {
        webSocketClient.send<SetFurnitureDataEventData<WiredTriggerUserSaysSomethingData>>("SetFurnitureDataEvent", {
            furnitureId: data.furniture.data.id,
            data: {
                type,
                message,
                hideMessage,
                onlyRoomOwner
            }
        });

        onClose();
    }, [type, message, hideMessage, onlyRoomOwner, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furniture.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>What is said:</b>

                <WiredInput placeholder="Enter message keyword..." readonly={type === "match_all"} value={(type === "match_all")?(""):(message)} onChange={setMessage}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Choose type:</b>

                <WiredRadio value={type} onChange={setType} items={[
                    {
                        label: "Contains keyword",
                        value: "keyword"
                    },
                    {
                        label: "Exact match",
                        value: "match"
                    },
                    {
                        label: "Match all text",
                        value: "match_all"
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>Select options:</b>

                <WiredCheckbox value={hideMessage} onChange={setHideMessage} label="Hide the triggerer's message"/>
                <WiredCheckbox value={onlyRoomOwner} onChange={setOnlyRoomOwner} label="Only the room owner can trigger"/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
