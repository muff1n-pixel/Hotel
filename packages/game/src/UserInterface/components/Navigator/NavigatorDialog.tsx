import Dialog from "../Dialog/Dialog";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import NavigatorRoomList from "./Rooms/NavigatorRoomList";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../hooks/useDialogs";
import { useState } from "react";
import { useNavigator } from "../../hooks/useNavigator";
import Input from "../Form/Input";
import { EnterRoomData } from "@pixel63/events";

export type NavigatorDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function NavigatorDialog({ hidden, onClose }: NavigatorDialogProps) {
    const { addUniqueDialog, closeDialog } = useDialogs();

    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");

    const navigator = useNavigator(tab, search);

    return (
        <Dialog title="Navigator" hidden={hidden} onClose={onClose} width={420} height={530}>
            <DialogTabs initialActiveIndex={1} withoutHeader onChange={(index) => {
                setTab(["public", "all", "events", "mine"][index]);
            }} tabs={[
                {
                    icon: "Public",
                    element: (
                        <div style={{
                            flex: "1 1 0",

                            overflowY: "overlay",

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {navigator?.map((navigator) => (
                                <NavigatorRoomList thumbnail={true} key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                    webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                        id: room.id
                                    }));

                                    closeDialog("navigator");
                                }}/>
                            ))}
                        </div>
                    ),
                },
                {
                    icon: "All Rooms",
                    element: (
                        <div style={{
                            flex: "1 1 0",

                            overflowY: "overlay",

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <Input placeholder="Search for a room name..." value={search} onChange={setSearch}>
                                <div className="sprite_room_user_motto_pen"/>
                            </Input>

                            {navigator?.map((navigator) => (
                                <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                    webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                        id: room.id
                                    }));

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
                            flex: "1 1 0",

                            overflowY: "overlay",

                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {navigator?.map((navigator) => (
                                <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                    webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                        id: room.id
                                    }));

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
