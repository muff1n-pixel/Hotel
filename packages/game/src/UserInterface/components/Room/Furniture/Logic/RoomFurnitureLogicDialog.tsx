import RoomFurnitureBackgroundDialog, { RoomFurnitureBackgroundDialogData } from "./Background/RoomFurnitureBackgroundDialog";
import RoomFurnitureDimmerDialog, { RoomFurnitureDimmerData } from "./Dimmer/RoomFurnitureDimmerDialog";
import RoomFurnitureStickiesDialog, { RoomFurnitureStickiesDialogData } from "./Stickies/RoomFurnitureStickiesDialog";
import RoomFurnitureBackgroundTonerDialog, { RoomFurnitureBackgroundTonerDialogData } from "./Toner/RoomFurnitureBackgroundTonerDialog";
import RoomFurnitureTrophyDialog, { RoomFurnitureTrophyDialogData } from "./Trophy/RoomFurnitureTrophyDialog";
import WiredActionShowMessageDialog from "./Wired/Action/WiredActionShowMessageDialog";
import WiredActionTeleportToFurnitureDialog from "./Wired/Action/WiredActionTeleportToFurnitureDialog";
import WiredTriggerSaysSomethingDialog, { WiredTriggerSaysSomethingDialogData } from "./Wired/Trigger/WiredTriggerSaysSomethingDialog";
import WiredUserSpecifierDialog from "./Wired/WiredUserSpecifierDialog";
import WiredTriggerStuffStateDialog from "./Wired/Trigger/WiredTriggerStuffStateDialog";
import WiredTriggerUserClicksOnTileDialog from "./Wired/Trigger/WiredTriggerUserClicksOnTileDialog";
import WiredTriggerPeriodicallyDialog from "./Wired/Trigger/WiredTriggerPeriodicallyDialog";
import WiredTriggerPeriodicallyShortDialog from "./Wired/Trigger/WiredTriggerPeriodicallyShortDialog";
import WiredTriggerPeriodicallyLongDialog from "./Wired/Trigger/WiredTriggerPeriodicallyLongDialog";
import WiredTriggerUserPerformsActionDialog from "./Wired/Trigger/WiredTriggerUserPerformsActionDialog";
import WiredSignalDialog from "./Wired/WiredSignalDialog";
import WiredFurnitureSelectionDialog from "./Wired/WiredFurnitureSelectionDialog";
import WiredDialog from "../../../Dialog/Wired/WiredDialog";
import WiredFurniture from "../../../Dialog/Wired/WiredFurniture";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";

export type RoomFurnitureLogicDialogProps = {
    data: RoomInstanceFurniture;
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

export default function RoomFurnitureLogicDialog(props: RoomFurnitureLogicDialogProps) {
    switch(props.data.data.furniture?.interactionType) {
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

        case "wf_trg_enter_room":
        case "wf_trg_leave_room":
        case "wf_trg_click_user":
            return (<WiredUserSpecifierDialog {...props}/>);

        case "wf_trg_walks_on_furni":
        case "wf_trg_walks_off_furni":
        case "wf_trg_state_changed":
        case "wf_trg_click_furni":
            return (<WiredFurnitureSelectionDialog {...props}/>);

        case "wf_trg_stuff_state":
            return (<WiredTriggerStuffStateDialog {...props}/>);

        case "wf_trg_click_tile":
            return (<WiredTriggerUserClicksOnTileDialog {...props}/>);

        case "wf_act_show_message":
            return (<WiredActionShowMessageDialog {...props}/>);

        case "wf_act_teleport_to":
            return (<WiredActionTeleportToFurnitureDialog {...props}/>);

        case "wf_trg_periodically":
            return (<WiredTriggerPeriodicallyDialog {...props}/>);

        case "wf_trg_period_short":
            return (<WiredTriggerPeriodicallyShortDialog {...props}/>);

        case "wf_trg_period_long":
            return (<WiredTriggerPeriodicallyLongDialog {...props}/>);

        case "wf_trg_user_performs_action":
            return (<WiredTriggerUserPerformsActionDialog {...props}/>);

        case "wf_trg_recv_signal":
        case "wf_act_send_signal":
            return (<WiredSignalDialog {...props}/>);
    }

    if(props.data.data.furniture?.type.startsWith("wf_")) {
        return (
            <WiredDialog onClose={props.onClose}>
                <WiredFurniture furniture={props.data.data}/>
            </WiredDialog>
        );
    }

    return null;
}