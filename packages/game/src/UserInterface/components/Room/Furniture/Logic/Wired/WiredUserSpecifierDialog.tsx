import WiredDialog from "../../../../Dialog/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../Dialog/Wired/WiredFurniture";
import WiredDivider from "../../../../Dialog/Wired/WiredDivider";
import WiredSection from "../../../../Dialog/Wired/WiredSection";
import WiredInput from "../../../../Dialog/Wired/WiredInput";
import { useCallback, useState } from "react";
import WiredRadio from "../../../../Dialog/Wired/WiredRadio";
import WiredButton from "../../../../Dialog/Wired/WiredButton";
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
