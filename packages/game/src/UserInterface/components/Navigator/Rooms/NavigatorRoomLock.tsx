import { NavigatorRoomData } from "@pixel63/events";

export type NavigatorRoomLockProps = {
    room: NavigatorRoomData;
}

export default function NavigatorRoomLock({ room }: NavigatorRoomLockProps) {
    switch(room.lock) {
        case "bell":
            return (<div className="sprite_room_lock_bell"/>);
            
        case "password":
            return (<div className="sprite_room_lock_password"/>);
            
        case "invisible":
            return (<div className="sprite_room_lock_invisible"/>);
    } 

    return null;
}