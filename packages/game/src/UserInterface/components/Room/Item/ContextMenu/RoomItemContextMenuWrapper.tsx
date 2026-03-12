import RoomItem from "@Client/Room/Items/RoomItem";
import { ReactNode, useCallback, useState } from "react";
import useRoomItemScreenPosition from "../../Users/Hooks/useRoomItemScreenPosition";
import UserContextMenuElement from "../../Users/UserContextMenuElement";
import "./RoomItemContextMenuWrapper.css";

export type RoomItemContextMenuWrapperProps = {
    item: RoomItem;
    children: ReactNode;
}

export default function RoomItemContextMenuWrapper({ item, children }: RoomItemContextMenuWrapperProps) {
    const position = useRoomItemScreenPosition(item);

    const [folded, setFolded] = useState(false);

    const handleFold = useCallback(() => {
        setFolded(!folded);
    }, [folded]);
    
    return (
        <div style={{
            position: "absolute",
            whiteSpace: "nowrap",

            left: position?.left,
            top: position?.top
        }}>
            <div className="arrow" style={{
                display: "flex",

                width: (!folded)?(100):("max-content"),

                transform: "translate(64px, -58px) translate(-50%, -100%)",

                background: "#2C2B2A",
                border: "1px solid #000000",
                borderBottomWidth: 2,
                borderRadius: 5,

                pointerEvents: "auto",
            }}>
                <div style={{
                    flex: 1,
                    border: "1px solid #3C3C3C",
                    borderRadius: 5,
                    boxSizing: "border-box",

                    fontSize: 12,

                    flexWrap: "wrap",

                    display: "flex",
                    flexDirection: "column"
                }}>
                    {(!folded) && (
                        children
                    )}

                    <UserContextMenuElement position="bottom" hideBorder={folded} onClick={handleFold}>
                        <div className="sprite_context-menu_arrow-down" style={{
                            transform: (folded)?("rotateZ(180deg)"):(undefined)
                        }}/>
                    </UserContextMenuElement>
                </div>

                <div className="arrow-outline"/>
            </div>
        </div>
    );
}