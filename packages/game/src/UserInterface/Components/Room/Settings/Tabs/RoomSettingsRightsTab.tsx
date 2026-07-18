import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import UserLink from "@UserInterface/Common/Users/UserLink";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { webSocketClient } from "@Game/index";
import { ClearRoomRightsData, SetRoomUserRightsData } from "@pixel63/events";
import useRoomRights from "@UserInterface/Hooks/useRoomRights";

export default function RoomSettingsRightsTab() {
    const room = useRoomInstance();
    const users = useRoomRights(room?.information?.id);

    if(!room) {
        return null;
    }

    return (
        <FlexLayout flex={1}>
            <b>Users with rights</b>
            
            <DialogTable style={{ flex: 1 }} items={users.map((user) => ({
                id: user.id,
                values: [
                    <UserLink id={user.id} name={user.name} reversed/>
                ],
                tools: (
                    <div
                        className="sprite_sub"
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            webSocketClient.sendProtobuff(SetRoomUserRightsData, SetRoomUserRightsData.create({
                                id: user.id,
                                hasRights: false
                            }));
                        }}/>
                )
            }))}/>

            <DialogButton onClick={() => {
                webSocketClient.sendProtobuff(ClearRoomRightsData, ClearRoomRightsData.create({}));
            }}>
                Remove all
            </DialogButton>
        </FlexLayout>
    );
}
