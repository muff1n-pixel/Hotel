import RoomFurnitureBackgroundDialog, { RoomFurnitureBackgroundDialogData } from "./Background/RoomFurnitureBackgroundDialog";
import RoomFurnitureDimmerDialog, { RoomFurnitureDimmerData } from "./Dimmer/RoomFurnitureDimmerDialog";
import RoomFurnitureStickiesDialog, { RoomFurnitureStickiesDialogData } from "./Stickies/RoomFurnitureStickiesDialog";
import RoomFurnitureBackgroundTonerDialog, { RoomFurnitureBackgroundTonerDialogData } from "./Toner/RoomFurnitureBackgroundTonerDialog";
import RoomFurnitureTrophyDialog, { RoomFurnitureTrophyDialogData } from "./Trophy/RoomFurnitureTrophyDialog";
import WiredActionShowMessageDialog from "./Wired/Action/WiredActionShowMessageDialog";
import WiredActionTeleportToFurnitureDialog from "./Wired/Action/WiredActionTeleportToFurnitureDialog";
import WiredTriggerSaysSomethingDialog, { WiredTriggerSaysSomethingDialogData } from "./Wired/Trigger/WiredTriggerSaysSomethingDialog";

export type RoomFurnitureLogicDialogProps<T = any> = {
    data: T;
    hidden?: boolean;
    onClose: () => void;
}

export type RoomFurnitureLogicDialogData =
    RoomFurnitureDimmerData
    | RoomFurnitureBackgroundDialogData
    | RoomFurnitureBackgroundTonerDialogData
    | RoomFurnitureStickiesDialogData
    | RoomFurnitureTrophyDialogData
    | WiredTriggerSaysSomethingDialogData;

export default function RoomFurnitureLogicDialog(props: RoomFurnitureLogicDialogProps<any>) {
    switch(props.data.type) {
        case "furniture_roomdimmer":
            return (<RoomFurnitureDimmerDialog {...props}/>);
            
        case "furniture_background":
            return (<RoomFurnitureBackgroundDialog {...props}/>);
            
        case "furniture_stickie":
            return (<RoomFurnitureStickiesDialog {...props}/>);
            
        case "furniture_background_color":
            return (<RoomFurnitureBackgroundTonerDialog {...props}/>);
            
        case "trophy":
            return (<RoomFurnitureTrophyDialog {...props}/>);

        case "wf_trg_says_something":
            return (<WiredTriggerSaysSomethingDialog {...props}/>);

        case "wf_act_show_message":
            return (<WiredActionShowMessageDialog {...props}/>);

        case "wf_act_teleport_to":
            return (<WiredActionTeleportToFurnitureDialog {...props}/>);
    }

    return null;
}