import { useTranslation } from "react-i18next";
import WiredDialog from "../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import WiredInput from "../../../../../Common/Dialog/Layouts/Wired/WiredInput";
import { useCallback, useState } from "react";
import WiredRadio from "../../../../../Common/Dialog/Layouts/Wired/WiredRadio";
import WiredButton from "../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../..";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import { useRoom } from "@UserInterface/Hooks/useRoom";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export type WiredUserSpecifierDialogData = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_enter_room";
};

export default function WiredUserSpecifierDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [match, setMatch] = useState(data.data.data?.wiredUserSpecifier?.match ?? "all");
    const [matchUser, setMatchUser] = useState(data.data.data?.wiredUserSpecifier?.matchUser ?? "");

    const handleApply = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredUserSpecifier: {
                    match,
                    matchUser
                }
            }
        }));

        onClose();
    }, [match, matchUser, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>{getTranslation("creator.select_triggering_user")}</b>

                <WiredRadio value={match} onChange={setMatch} items={[
                    {
                        label: getTranslation("creator.any_user"),
                        value: "all"
                    },
                    {
                        label: getTranslation("creator.specific_user"),
                        value: "user"
                    }
                ]}/>

                <WiredInput placeholder={getTranslation("creator.enter_user_name")} readonly={match !== "user"} value={(match === "user")?(matchUser):("")} onChange={setMatchUser}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={onClose}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
