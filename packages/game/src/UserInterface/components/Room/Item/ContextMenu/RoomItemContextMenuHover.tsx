import RoomItem from "@Client/Room/Items/RoomItem";
import { useEffect, useState } from "react";
import useRoomItemScreenPosition from "../../Users/Hooks/useRoomItemScreenPosition";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";

export type RoomItemContextMenuHoverProps = {
    item: RoomItem;
}

export default function RoomItemContextMenuHover({ item }: RoomItemContextMenuHoverProps) {
    const room = useRoomInstance();
    const position = useRoomItemScreenPosition(item);

    const [name, setName] = useState<string>();

    useEffect(() => {
        if(item instanceof RoomFigureItem) {
            if(item.type === "figure") {
                const user = room?.getUserByItem(item);

                setName(user?.data.name);
            }
            else if(item.type === "bot") {
                const bot = room?.getBotByItem(item);

                setName(bot?.data.name);
            }
        }
        else if(item instanceof RoomPetItem) {
            const pet = room?.getPetByItem(item);

            setName(pet?.data.name);
        }
    }, [room, item]);

    return (
        <div style={{
            position: "absolute",
            whiteSpace: "nowrap",

            left: position?.left,
            top: position?.top
        }}>
            <div className="arrow" style={{
                display: "flex",

                transform: "translate(64px, -58px) translate(-50%, -100%)",

                background: "#2C2B2A",
                border: "1px solid #000000",
                borderBottomWidth: 2,
                borderRadius: 5,
            }}>
                <div style={{
                    flex: 1,
                    border: "1px solid #3C3C3C",
                    borderRadius: 5,
                    boxSizing: "border-box",

                    fontSize: 12,

                    padding: "5px 12px",

                    flexWrap: "wrap",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {name}
                </div>

                <div className="arrow-outline"/>
            </div>
        </div>
    );
}