import { useTranslation } from "react-i18next";
import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import WiredInput from "../../../../../../Common/Dialog/Layouts/Wired/WiredInput";
import { useCallback, useState } from "react";
import WiredRadio from "../../../../../../Common/Dialog/Layouts/Wired/WiredRadio";
import WiredCheckbox from "../../../../../../Common/Dialog/Layouts/Wired/WiredCheckbox";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export type WiredTriggerSaysSomethingDialogData = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredTriggerSaysSomethingDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [type, setType] = useState(data.data.data?.wiredTriggerUserSaysSomething?.type ?? "match");
    const [message, setMessage] = useState(data.data.data?.wiredTriggerUserSaysSomething?.message ?? "");
    const [hideMessage, setHideMessage] = useState(data.data.data?.wiredTriggerUserSaysSomething?.hideMessage ?? true);
    const [onlyRoomOwner, setOnlyRoomOwner] = useState(data.data.data?.wiredTriggerUserSaysSomething?.onlyRoomOwner ?? false);

    const handleApply = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
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
    }, [type, message, hideMessage, onlyRoomOwner, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.what_is_said")}</b>

                <WiredInput placeholder={getTranslation("creator.enter_message_keyword")} readonly={type === "match_all"} value={(type === "match_all")?(""):(message)} onChange={setMessage}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.choose_type")}</b>

                <WiredRadio value={type} onChange={setType} items={[
                    {
                        label: getTranslation("creator.contains_keyword"),
                        value: "keyword"
                    },
                    {
                        label: getTranslation("creator.exact_match"),
                        value: "match"
                    },
                    {
                        label: getTranslation("creator.match_all_text"),
                        value: "match_all"
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.select_options")}</b>

                <WiredCheckbox value={hideMessage} onChange={setHideMessage} label={getTranslation("creator.hide_trigger_message")}/>
                <WiredCheckbox value={onlyRoomOwner} onChange={setOnlyRoomOwner} label={getTranslation("creator.only_room_owner")}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={onClose}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
