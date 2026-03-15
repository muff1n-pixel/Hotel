import { NavigatorRoomData } from "@pixel63/events";
import { RefObject, useEffect, useRef } from "react";
import DialogPanel from "src/UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import UserLink from "src/UserInterface/Common/Users/UserLink";
import RoomThumbnail from "src/UserInterface/Components/Room/Thumbnail/RoomThumbnail";

export type NavigatorRoomProfileProps = {
    elementRef: RefObject<HTMLDivElement | null>;

    room: NavigatorRoomData;
};

export default function NavigatorRoomProfile({ elementRef, room }: NavigatorRoomProfileProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        if(!panelRef.current) {
            return;
        }

        panelRef.current.style.display = "block";
        panelRef.current.style.top = `${elementRef.current.offsetTop - (elementRef.current.parentElement?.parentElement?.parentElement?.parentElement?.scrollTop ?? 0)}px`;
        panelRef.current.style.left = `${elementRef.current.clientWidth}px`;
    }, [panelRef, elementRef]);

    return (
        <DialogPanel ref={panelRef} arrow color="beige" style={{
            display: "none",

            pointerEvents: "none",

            position: "fixed",

            left: 0,
            top: 0,

            transform: "translateY(-100px)",

            marginLeft: 23,

            zIndex: 1
        }} contentStyle={{
            height: 200,
            width: 340,

            padding: 6,

            display: "flex",
            flexDirection: "column",

            gap: 10
        }}>
            <div style={{
                flex: 1,

                backgroundColor: "#FFFFFF",
                borderRadius: 5,

                padding: 8,

                display: "flex",
                flexDirection: "row",
                gap: 10
            }}>
                <RoomThumbnail roomId={room.id} thumbnail={room.thumbnail} disallowEdit/>

                <div>
                    <b>{room.name}</b>

                    <p>{room.description}</p>
                </div>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
            }}>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 5
                }}>
                    <b><u><UserLink id={room.ownerId} name={room.ownerName}/></u></b>
                    
                    <div/>

                    <div><b>Max users:</b> {room.maxUsers}</div>
                </div>
            </div>
        </DialogPanel>
    );
}
