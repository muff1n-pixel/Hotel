import { ReactNode } from "react";
import { useDialogs } from "../../../hooks/useDialogs";
import { useRoomInstance } from "../../../hooks/useRoomInstance";

export type RoomThumbnailProps = {
    roomId: string;
    thumbnail?: string;
    disallowEdit?: boolean;
    children?: ReactNode;
};

export default function RoomThumbnail({ roomId, thumbnail, disallowEdit, children }: RoomThumbnailProps) {
    const room = useRoomInstance();
    const dialogs = useDialogs();

    return (
        <div style={{
            width: 112,
            height: 112,

            boxSizing: "border-box",

            border: "1px solid black",
            backgroundColor: "#B4B3AA",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            position: "relative"
        }}>
            {(!thumbnail)?(
                <div className="sprite_room_thumbnail_empty"/>
            ):(
                <img src={thumbnail}/>
            )}

            {(!disallowEdit&& room && room.id === roomId && room.hasRights) && (
                <div className="sprite_room_camera" style={{
                    position: "absolute",

                    bottom: 3,
                    right: 3,

                    cursor: "pointer"
                }} onClick={() =>
                    dialogs.addUniqueDialog("room-settings-thumbnail")
                }/>
            )}

            {(children) && (
                <div style={{
                    position: "absolute",

                    left: 0,
                    top: 0,

                    width: "100%",
                    height: "100%",

                    display: "flex",
                    flexDirection: "row"
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}
