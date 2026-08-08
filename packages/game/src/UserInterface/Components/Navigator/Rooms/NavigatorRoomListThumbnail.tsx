import NavigatorRoomUsersCount from "./NavigatorRoomUsersCount";
import { NavigatorRoomData } from "@pixel63/events";
import RoomThumbnail from "@UserInterface/Components/Room/Thumbnail/RoomThumbnail";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { RefObject, useRef, useState } from "react";
import NavigatorRoomProfile from "./NavigatorRoomProfile";

export type NavigatorRoomListThumbnailProps = {
    parentRef: RefObject<HTMLDivElement | null>;
    
    room: NavigatorRoomData;
    onClick: () => void;
}

export default function NavigatorRoomListThumbnail({ parentRef, room, onClick }: NavigatorRoomListThumbnailProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    
    const [hovered, setHovered] = useState(false);
    
    return (
        <div key={room.id} ref={elementRef} style={{
            background: "#EAE8DE",
            
            borderBottom: "2px solid #CCCCCC",
            borderRadius: 6,

            padding: 5,

            display: "flex",
            flexDirection: "column",

            gap: 5,

            position: "relative"
        }} onClick={onClick}>
            <RoomThumbnail roomId={room.id} thumbnail={room.thumbnail} disallowEdit>
                <FlexLayout flex={1}>
                    {(room.group) && (
                        <div style={{
                            padding: 2
                        }}>
                            <div className="sprite_groups_icon"/>
                        </div>
                    )}

                    <div style={{
                        flex: 1,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",

                        padding: 4
                    }}>
                        <div>
                            <NavigatorRoomUsersCount users={room.users} maxUsers={room.maxUsers}/>
                        </div>
                    </div>
                </FlexLayout>
            </RoomThumbnail>

            <FlexLayout direction="row" gap={0} style={{
                fontSize: 12,
                maxWidth: 112
            }}>
                <div style={{ flex: 1, fontSize: 12, maxWidth: 112 }}>{room.name}</div>

                <div className="sprite_navigator_information" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}/>
            </FlexLayout>

            {(hovered) && (
                <NavigatorRoomProfile
                    elementRef={elementRef}
                    parentRef={parentRef}
                    room={room}/>
            )}
        </div>
    );
}
