import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import NavigatorRoomList from "./Rooms/NavigatorRoomList";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks/useDialogs";
import { useState } from "react";
import { useNavigator } from "../../Hooks/useNavigator";
import Input from "../../Common/Form/Components/Input";
import { EnterRoomData } from "@pixel63/events";
import DialogScrollArea from "../../Common/Dialog/Components/Scroll/DialogScrollArea";
import NavigatorSearch from "./NavigatorSearch";

export type NavigatorDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function NavigatorDialog({ hidden, onClose }: NavigatorDialogProps) {
    const { addUniqueDialog, closeDialog } = useDialogs();

    const [tab, setTab] = useState("all");
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState("");

    const navigator = useNavigator(tab, filter, search);

    return (
        <Dialog title="Navigator" hidden={hidden} onClose={onClose} width={430} height={530} style={{
            overflow: "visible"
        }}>
            <DialogTabs initialActiveIndex={1} withoutHeader onChange={(index) => {
                setTab(["public", "all", "events", "mine"][index]);
                setSearch("");
                setFilter(undefined);
            }} tabs={[
                {
                    icon: "Public",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 5
                        }}>
                            <NavigatorSearch filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch}/>

                            <DialogScrollArea>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList thumbnail={true} key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                        webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                            id: room.id
                                        }));

                                        closeDialog("navigator");
                                    }}/>
                                ))}
                            </DialogScrollArea>
                        </div>
                    ),
                },
                {
                    icon: "All Rooms",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 5
                        }}>
                            <NavigatorSearch filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch}/>

                            <DialogScrollArea>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                        webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                            id: room.id
                                        }));

                                        closeDialog("navigator");
                                    }}/>
                                ))}
                            </DialogScrollArea>
                        </div>
                    ),
                },
                {
                    icon: "Events",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 5
                        }}>
                            <NavigatorSearch filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch}/>

                            <DialogScrollArea>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                        webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                            id: room.id
                                        }));

                                        closeDialog("navigator");
                                    }}/>
                                ))}
                            </DialogScrollArea>
                        </div>
                    ),
                },
                {
                    icon: "My Rooms",
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            gap: 5
                        }}>
                            <NavigatorSearch filter={filter} onFilterChange={setFilter} search={search} onSearchChange={setSearch}/>
                            
                            <DialogScrollArea>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
                                        webSocketClient.sendProtobuff(EnterRoomData, EnterRoomData.create({
                                            id: room.id
                                        }));

                                        closeDialog("navigator");
                                    }}/>
                                ))}
                            </DialogScrollArea>
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
