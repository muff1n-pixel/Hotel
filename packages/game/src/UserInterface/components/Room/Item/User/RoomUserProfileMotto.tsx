import { useState } from "react";

export type RoomUserProfileMottoProps = {
    canEdit: boolean;
    
    value: string | null;
    onChange: (value: string) => void;
}

export default function RoomUserProfileMotto({ canEdit, value, onChange }: RoomUserProfileMottoProps) {
    const [editting, setEditting] = useState(false);
    const [motto, setMotto] = useState(value ?? "");

    return (
        <div style={{
            width: "100%",

            background: "rgba(255, 255, 255, .1)",
            border: "1px solid #000",
            borderRadius: 6,

            display: "flex",
            flexDirection: "row",
            gap: 2,

            padding: "2px 4px",
            boxSizing: "border-box",

            alignItems: "center"
        }} onClick={() => (canEdit && !editting) && setEditting(true)}>
            {(canEdit) && (
                <div className="sprite_room_user_motto_pen"/>
            )}

            {(editting)?(
                <input className="room-user-profile-motto" autoFocus maxLength={40} value={motto ?? ""} onChange={(event) => setMotto((event.target as HTMLInputElement).value)} onKeyDown={(event) => {
                    if(event.key === "Enter") {
                        setEditting(false);
                        onChange(motto);
                    }
                }}/>
            ):(
                <div style={{
                    maxWidth: 130,
                    fontSize: 11,
                    textWrap: "wrap",
                    textOverflow: "clip"
                }}>
                    {motto}
                </div>
            )}
        </div>
    );
}
