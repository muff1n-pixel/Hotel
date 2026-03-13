import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredSelection from "../../../../../../Common/Dialog/Layouts/Wired/Selection/WiredSelection";
import WiredCheckbox from "../../../../../../Common/Dialog/Layouts/Wired/WiredCheckbox";
import { UpdateRoomFurnitureData } from "@pixel63/events";

export type WiredTriggerUserPerformsActionDialog = {
    furniture: RoomInstanceFurniture;
    type: "wf_trg_says_something";
};

export default function WiredTriggerUserPerformsActionDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [action, setAction] = useState(data.data.data?.wiredTriggerUserPerformsAction?.action ?? "Wave");
    const [filter, setFilter] = useState(data.data.data?.wiredTriggerUserPerformsAction?.filter ?? false);
    const [filterId, setFilterId] = useState(data.data.data?.wiredTriggerUserPerformsAction?.filterId ?? 1);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                wiredTriggerUserPerformsAction: {
                    action,
                    filter,
                    filterId
                }
            }
        }));

        onClose();
    }, [action, filter, filterId, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.data}/>

            <WiredDivider/>

            <WiredSection>
                <b>Action:</b>

                <WiredSelection value={action} onChange={setAction} items={["Wave", "Blow", "Laugh", "Thumbs up", "Awake", "Idle", "Sit", "Stand", "Lay", "Sign", "Dance"].map((action) => {
                    return {
                        value: action,
                        label: action
                    };
                })}/>
            </WiredSection>

            {(["Dance", "Sign"].includes(action)) && (
                <WiredDivider/>
            )}

            {(action === "Dance") && (
                <WiredSection>
                    <WiredCheckbox value={filter} onChange={setFilter} label="Filter by dance"/>

                    {(filter) && (
                        <WiredSelection value={filterId} onChange={setFilterId} items={[
                            {
                                value: 1,
                                label: "Dance"
                            },
                            {
                                value: 2,
                                label: "Pogo Mogo"
                            },
                            {
                                value: 3,
                                label: "Duck Funk"
                            },
                            {
                                value: 4,
                                label: "The Rollie"
                            }
                        ]}/>
                    )}
                </WiredSection>
            )}

            {(action === "Sign") && (
                <WiredSection>
                    <WiredCheckbox value={filter} onChange={setFilter} label="Filter by sign"/>

                    {(filter) && (
                        <WiredSelection value={filterId} onChange={setFilterId} items={Array(10).fill(null).map((_, number) => {
                            return {
                                value: number + 1,
                                label: "Number " + (number + 1)
                            };
                        })}/>
                    )}
                </WiredSection>
            )}

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
