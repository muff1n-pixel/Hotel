import Dialog from "../Dialog/Dialog";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import NavigatorRoomList from "./Rooms/NavigatorRoomList";
import { webSocketClient } from "../../..";
import { EnterRoomEventData } from "@Shared/Communications/Requests/Rooms/EnterRoomEventData";
import { useDialogs } from "../../hooks/useDialogs";
import { useState } from "react";
import { useNavigator } from "../../hooks/useNavigator";

export type NavigatorDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function NavigatorDialog({ hidden, onClose }: NavigatorDialogProps) {
    const { addUniqueDialog, closeDialog } = useDialogs();

    const [tab, setTab] = useState("all");

    const navigator = useNavigator(tab);

    return (
        <Dialog title="Navigator" hidden={hidden} onClose={onClose} width={420} height={530}>
            <DialogTabs initialActiveIndex={1} withoutHeader onChange={(index) => {
                setTab(["public", "all", "events", "mine"][index]);
            }} tabs={[
                {
                    icon: "Public",
                    element: (<div style={{ flex: 1 }}/>),
                },
                {
                    icon: "All Rooms",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {navigator!.map((navigator) => (
                                <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                    webSocketClient.send<EnterRoomEventData>("EnterRoomEvent", {
                                        roomId: room.id
                                    });

                                    closeDialog("navigator");
                                }}/>
                            ))}
                        </div>
                    ),
                },
                {
                    icon: "Events",
                    element: (<div style={{ flex: 1 }}/>),
                },
                {
                    icon: "My Rooms",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {navigator!.map((navigator) => (
                                <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                    webSocketClient.send<EnterRoomEventData>("EnterRoomEvent", {
                                        roomId: room.id
                                    });

                                    closeDialog("navigator");
                                }}/>
                            ))}
                        </div>
                    ),
                }
            ]}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <div style={{
                        border: "1px solid black",
                        borderRadius: 5,
                        overflow: "hidden",
                        background: "#FFFFFF",
                        padding: 1,
                        cursor: "pointer"
                    }} onClick={() => addUniqueDialog("room-creation")}>
                        <div className="sprite_navigator_banner-create-room" style={{
                            borderRadius: 5
                        }}/>
                    </div>

                    <div style={{
                        border: "1px solid black",
                        borderRadius: 5,
                        overflow: "hidden",
                        background: "#FFFFFF",
                        padding: 1,
                        cursor: "pointer"
                    }}>
                        <div className="sprite_navigator_banner-random" style={{
                            borderRadius: 5
                        }}/>
                    </div>
                </div>
            </DialogTabs>
        </Dialog>
    );
}
