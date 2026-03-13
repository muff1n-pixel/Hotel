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

export type WiredUserSpecifierDialogData = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_enter_room";
};

export default function WiredUserSpecifierDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [match, setMatch] = useState(data.data.data?.wiredUserSpecifier?.match ?? "all");
    const [matchUser, setMatchUser] = useState(data.data.data?.wiredUserSpecifier?.matchUser ?? "");

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredUserSpecifier: {
                    match,
                    matchUser
                }
            }
        }));

        onClose();
    }, [match, matchUser, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>Select triggering user:</b>

                <WiredRadio value={match} onChange={setMatch} items={[
                    {
                        label: "Any user",
                        value: "all"
                    },
                    {
                        label: "Specific user",
                        value: "user"
                    }
                ]}/>

                <WiredInput placeholder="Enter user name..." readonly={match !== "user"} value={(match === "user")?(matchUser):("")} onChange={setMatchUser}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
