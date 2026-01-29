import { Fragment } from "react/jsx-runtime";
import Dialog from "../Dialog/Dialog";
import DialogList from "../Dialog/List/DialogList";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import DialogListContainer from "../Dialog/List/DialogListContainer";
import NavigatorRoomList from "./Rooms/NavigatorRoomList";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import useNavigatorRooms from "./Hooks/useNavigatorRooms";
import { webSocketClient } from "../../..";
import { EnterRoomEventData } from "@Shared/Communications/Requests/Rooms/EnterRoomEventData";
import { useDialogs } from "../../hooks/useDialogs";

export type NavigatorDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function NavigatorDialog({ hidden, onClose }: NavigatorDialogProps) {
    const { addUniqueDialog, closeDialog } = useDialogs();

    const rooms = useNavigatorRooms("all");

    return (
        <Dialog title="Navigator" hidden={hidden} onClose={onClose} width={420} height={530}>
            <DialogTabs initialActiveIndex={1} withoutHeader tabs={[
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
                            <NavigatorRoomList rooms={rooms} onClick={(room) => {
                                webSocketClient.send<EnterRoomEventData>("EnterRoomEvent", {
                                    roomId: room.id
                                });

                                closeDialog("navigator");
                            }}/>
                        </div>
                    ),
                },
                {
                    icon: "Events",
                    element: (<div style={{ flex: 1 }}/>),
                },
                {
                    icon: "My Rooms",
                    element: (<div style={{ flex: 1 }}/>),
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
