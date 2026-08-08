import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import NavigatorRoomList from "./Rooms/NavigatorRoomList";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks/useDialogs";
import { useRef, useState } from "react";
import { useNavigator } from "../../Hooks/useNavigator";
import { EnterRandomRoomData, EnterRoomData } from "@pixel63/events";
import DialogScrollArea from "../../Common/Dialog/Components/Scroll/DialogScrollArea";
import NavigatorSearch from "./NavigatorSearch";
import useShopPageLink from "../Shop/Hooks/useShopPageLink";

export type NavigatorDialogProps = {
    hidden?: boolean;
    data?: {
        initialFilter?: string;
    };

    onClose?: () => void;
}

export default function NavigatorDialog({ hidden, data, onClose }: NavigatorDialogProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    const { addUniqueDialog, closeDialog } = useDialogs();

    const [tab, setTab] = useState("all");
    const [filter, setFilter] = useState<string | undefined>(data?.initialFilter);
    const [search, setSearch] = useState("");

    const navigator = useNavigator(tab, filter, search);
    const { openShopPage } = useShopPageLink("roomevent");

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

                            <DialogScrollArea ref={elementRef}>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList parentRef={elementRef} thumbnail={true} key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
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

                            <DialogScrollArea ref={elementRef}>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList parentRef={elementRef} key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
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

                            <DialogScrollArea ref={elementRef}>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList parentRef={elementRef} key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
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
                            
                            <DialogScrollArea ref={elementRef}>
                                {navigator?.map((navigator) => (
                                    <NavigatorRoomList parentRef={elementRef} key={navigator.title} title={navigator.title} rooms={navigator.rooms} onClick={(room) => {
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
                        cursor: "pointer",
                        position: "relative"
                    }} onClick={() => addUniqueDialog("room-creation")}>
                        <div className="sprite_navigator_banner-create-room" style={{
                            borderRadius: 5
                        }}/>

                        <div style={{
                            position: "absolute",

                            left: "15%",
                            top: 0,

                            display: "flex",

                            width: "100%",
                            height: "100%",

                            justifyContent: "center",
                            alignItems: "center",

                            color: "#FFFFFF"
                        }}>
                            <b>Create a room</b>
                        </div>
                    </div>

                    {(["all", "public"].includes(tab))?(
                        <div style={{
                            border: "1px solid black",
                            borderRadius: 5,
                            overflow: "hidden",
                            background: "#FFFFFF",
                            padding: 1,
                            cursor: "pointer",

                            position: "relative"
                        }} onClick={() => {
                            webSocketClient.sendProtobuff(EnterRandomRoomData, EnterRandomRoomData.create({}));
                        }}>
                            <div className="sprite_navigator_banner-random" style={{
                                borderRadius: 5
                            }}/>

                            <div style={{
                                position: "absolute",

                                left: "15%",
                                top: 0,

                                display: "flex",

                                width: "100%",
                                height: "100%",

                                justifyContent: "center",
                                alignItems: "center",

                                color: "#FFFFFF"
                            }}>
                                <b>Somewhere new</b>
                            </div>
                        </div>
                    ):(
                        <div style={{
                            border: "1px solid black",
                            borderRadius: 5,
                            overflow: "hidden",
                            background: "#FFFFFF",
                            padding: 1,
                            cursor: "pointer",

                            position: "relative"
                        }} onClick={() => {
                            openShopPage();
                        }}>
                            <div className="sprite_navigator_banner-event" style={{
                                borderRadius: 5
                            }}/>

                            <div style={{
                                position: "absolute",

                                left: "15%",
                                top: 0,

                                display: "flex",

                                width: "100%",
                                height: "100%",

                                justifyContent: "center",
                                alignItems: "center",

                                color: "#FFFFFF"
                            }}>
                                <b>Promote event</b>
                            </div>
                        </div>
                    )}
                </div>
            </DialogTabs>
        </Dialog>
    );
}
