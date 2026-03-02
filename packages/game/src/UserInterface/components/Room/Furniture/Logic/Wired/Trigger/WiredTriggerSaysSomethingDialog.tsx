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
import { webSocketClient } from "../../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredTriggerSaysSomethingDialogData = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredTriggerSaysSomethingDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [type, setType] = useState(data.data.data?.wiredTriggerUserSaysSomething?.type ?? "match");
    const [message, setMessage] = useState(data.data.data?.wiredTriggerUserSaysSomething?.message ?? "");
    const [hideMessage, setHideMessage] = useState(data.data.data?.wiredTriggerUserSaysSomething?.hideMessage ?? true);
    const [onlyRoomOwner, setOnlyRoomOwner] = useState(data.data.data?.wiredTriggerUserSaysSomething?.onlyRoomOwner ?? false);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,
            data: {
                wiredTriggerUserSaysSomething: {
                    type,
                    message,
                    hideMessage,
                    onlyRoomOwner
                }
            }
        }));

        onClose();
    }, [type, message, hideMessage, onlyRoomOwner, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

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
