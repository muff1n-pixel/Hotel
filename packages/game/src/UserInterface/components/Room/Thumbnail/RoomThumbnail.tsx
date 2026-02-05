export type RoomThumbnailProps = {
    roomId: string;
};

export default function RoomThumbnail({ roomId }: RoomThumbnailProps) {
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
            <div className="sprite_room_thumbnail_empty"/>

            <div className="sprite_room_camera" style={{
                position: "absolute",

                bottom: 3,
                right: 3,

                cursor: "pointer"
            }}/>
        </div>
    );
}
