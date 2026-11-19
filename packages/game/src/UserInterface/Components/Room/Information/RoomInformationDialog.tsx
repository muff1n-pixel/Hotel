import { useCallback, useState } from "react";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { webSocketClient } from "../../../..";
import RoomThumbnail from "../Thumbnail/RoomThumbnail";
import { useUser } from "../../../Hooks/useUser";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { useDialogs } from "../../../Hooks/useDialogs";
import { SetUserHomeRoomData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import { useRoomGroup } from "@UserInterface/Hooks/useRoomGroup";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import { useTranslation } from "react-i18next";

export type RoomInformationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomInformationDialog({ hidden, onClose }: RoomInformationDialogProps) {
    const [getTranslation] = useTranslation("room");
    const user = useUser();
    const room = useRoomInstance();
    const dialogs = useDialogs();
    const roomGroup = useRoomGroup();

    const [homeRoomActive, setHomeRoomActive] = useState(room?.id === user?.homeRoomId);

    const handleHomeRoomClick = useCallback(() => {
        if(!room) {
            return;
        }

        webSocketClient.sendProtobuff(SetUserHomeRoomData, SetUserHomeRoomData.create({
            roomId: (homeRoomActive)?(undefined):(room.id)
        }));

        setHomeRoomActive(!homeRoomActive);
    }, [room, homeRoomActive]);

    if(!room) {
        return null;
    }

    return (
        <Dialog title={getTranslation("information.title")} hidden={hidden} onClose={onClose} width={230} height={"auto"} assumedHeight={280}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <b>{room.information?.name}</b>
                        </div>

                        <div style={{
                            cursor: "pointer"
                        }} onClick={handleHomeRoomClick}>
                            <div className={(homeRoomActive)?("sprite_navigator_home"):("sprite_navigator_home_inactive")}/>
                        </div>
                    </div>

                    <div><b style={{ color: "#7A7A7A" }}>{getTranslation("information.owner")}</b> {room.information?.owner?.name}</div>

                    {(room.information?.description) && (
                        <div>
                            <p>{room.information?.description}</p>
                        </div>
                    )}

                    <div style={{
                        flex: 1,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <RoomThumbnail roomId={room.id} thumbnail={room.information?.thumbnail}/>
                    </div>

                    {(roomGroup?.group) && (
                        <FlexLayout direction="row" onClick={() => dialogs.addUniqueDialog("group", roomGroup.group?.id, roomGroup.group?.id)} style={{
                            padding: "8px 0"
                        }}>
                            <FlexLayout flex={1} justify="center" align="center">
                                <GroupBadgeImage data={roomGroup.group.badge}/>
                            </FlexLayout>

                            <DialogLink>
                                {getTranslation("information.homeroom", { name: roomGroup.group.name })}
                            </DialogLink>
                        </FlexLayout>
                    )}

                    {(room.hasRights) && (
                        <DialogButton onClick={() => dialogs.addUniqueDialog("room-settings")}>{getTranslation("information.settings")}</DialogButton>
                    )}

                    {(room.hasRights) && (
                        <DialogButton onClick={() => dialogs.addUniqueDialog("room-floorplan")}>{getTranslation("information.floorplan")}</DialogButton>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
