import { RoomMapData, RoomStructureData } from "@pixel63/events";
import MembershipSmallIcon from "@UserInterface/Common/Memberships/MembershipSmallIcon";
import RoomMapImage from "@UserInterface/Components/Room/Map/RoomMapImage";
import useShopPageLink from "@UserInterface/Components/Shop/Hooks/useShopPageLink";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUser } from "@UserInterface/Hooks/useUser";
import DateHelper from "@UserInterface/Utils/DateHelper";
import { useCallback } from "react";

export type RoomCreationMapProps = {
    roomMap: RoomMapData;
    activeRoomMap?: RoomMapData;
    onSelect: () => void;
    editMode?: boolean;
}

export default function RoomCreationMap({ activeRoomMap, roomMap, editMode, onSelect }: RoomCreationMapProps) {
    const user = useUser();

    const { addUniqueDialog } = useDialogs();

    const { openShopPage } = useShopPageLink(roomMap.membership);

    const handleClick = useCallback(() => {
        if(editMode) {
            return;
        }
        
        if(roomMap.membership === "habboclub") {
            if(!DateHelper.isDateInTheFuture(user.habboClub)) {
                openShopPage();

                return;
            }
        }

        onSelect();
    }, [editMode, roomMap, onSelect, openShopPage, user]);

    return (
        <div key={roomMap.id} style={{
            width: 135,
            height: 96,

            border: "1px solid #5D5D5A",
            background: (activeRoomMap?.id === roomMap.id)?("#6E8184"):("#CBCBCB"),

            borderRadius: 6,
            overflow: "hidden",

            position: "relative",

            cursor: "pointer"
        }} onClick={handleClick}>
            <RoomMapImage staticImage width={180} height={120} structure={RoomStructureData.create({
                grid: roomMap.grid,
                door: roomMap.door,
                floor: {
                    id: "preview",
                    thickness: 0
                },
                wall: {
                    id: "preview",
                    thickness: 0,
                    hidden: false
                }
            })} leftWallColor={["D48612"]}/>

            {(roomMap.membership) && (
                <div style={{
                    position: "absolute",
                    top: 4,
                    right: 3,
                }}>
                    <MembershipSmallIcon membership={roomMap.membership}/>
                </div>
            )}

            {(editMode) && (
                <div style={{
                    position: "absolute",
                    top: 4,
                    right: 3,
                    cursor: "pointer"
                }} onClick={() => addUniqueDialog("edit-room-map", { map: roomMap })}>
                    <div className="sprite_room_user_motto_pen"/>
                </div>
            )}
        </div>
    );
}