import RoomFurnitureBackgroundDialog from "./Background/RoomFurnitureBackgroundDialog";
import RoomFurnitureDimmerDialog from "./Dimmer/RoomFurnitureDimmerDialog";
import RoomFurnitureStickiesDialog from "./Stickies/RoomFurnitureStickiesDialog";
import RoomFurnitureBackgroundTonerDialog from "./Toner/RoomFurnitureBackgroundTonerDialog";
import RoomFurnitureTrophyDialog from "./Trophy/RoomFurnitureTrophyDialog";
import WiredActionShowMessageDialog from "./Wired/Action/WiredActionShowMessageDialog";
import WiredActionTeleportToFurnitureDialog from "./Wired/Action/WiredActionTeleportToFurnitureDialog";
import WiredTriggerSaysSomethingDialog from "./Wired/Trigger/WiredTriggerSaysSomethingDialog";
import WiredUserSpecifierDialog from "./Wired/WiredUserSpecifierDialog";
import WiredTriggerStuffStateDialog from "./Wired/Trigger/WiredTriggerStuffStateDialog";
import WiredTriggerUserClicksOnTileDialog from "./Wired/Trigger/WiredTriggerUserClicksOnTileDialog";
import WiredTriggerPeriodicallyDialog from "./Wired/Trigger/WiredTriggerPeriodicallyDialog";
import WiredTriggerPeriodicallyShortDialog from "./Wired/Trigger/WiredTriggerPeriodicallyShortDialog";
import WiredTriggerPeriodicallyLongDialog from "./Wired/Trigger/WiredTriggerPeriodicallyLongDialog";
import WiredTriggerUserPerformsActionDialog from "./Wired/Trigger/WiredTriggerUserPerformsActionDialog";
import WiredSignalDialog from "./Wired/WiredSignalDialog";
import WiredFurnitureSelectionDialog from "./Wired/WiredFurnitureSelectionDialog";
import WiredDialog from "../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import WiredFurniture from "../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import RoomFurnitureStackHelperDialog from "@UserInterface/Components/Room/Furniture/Logic/StackHelper/RoomFurnitureStackHelperDialog";
import RoomFurnitureClothingDialog from "@UserInterface/Components/Room/Furniture/Logic/Clothing/RoomFurnitureClothingDialog";
import RoomFurnitureMannequinDialog from "@UserInterface/Components/Room/Furniture/Logic/Mannequin/RoomFurnitureMannequinDialog";
import WiredTriggerClockCounterDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Trigger/WiredTriggerClockCounterDialog";
import WiredTriggerAtGivenTimeDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Trigger/WiredTriggerAtGivenTimeDialog";
import WiredDivider from "@UserInterface/Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "@UserInterface/Common/Dialog/Layouts/Wired/WiredSection";
import WiredButton from "@UserInterface/Common/Dialog/Layouts/Wired/WiredButton";
import WiredTriggerScoreAchievedDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Trigger/WiredTriggerScoreAchievedDialog";
import WiredActionToggleStateDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Action/WiredActionToggleStateDialog";
import WiredActionMoveRotateDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Action/WiredActionMoveRotateDialog";
import WiredActionMoveRotateUserDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Action/WiredActionMoveRotateUserDialog";
import WiredActionMatchToPositionStateDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Action/WiredActionMatchToPositionStateDialog";
import WiredActionToggleRandomStateDialog from "@UserInterface/Components/Room/Furniture/Logic/Wired/Action/WiredActionToggleRandomStateDialog";

export type RoomFurnitureLogicDialogProps = {
    data: RoomFurniture;
    hidden?: boolean;
    onClose: () => void;
}

export type RoomFurnitureLogicDialogData = {
    furniture: RoomFurniture;
};

export default function RoomFurnitureLogicDialog(props: RoomFurnitureLogicDialogProps) {
    switch(props.data.furnitureData.interactionType) {
        case "dimmer":
            return (<RoomFurnitureDimmerDialog {...props}/>);
            
        case "ads_bg":
            return (<RoomFurnitureBackgroundDialog {...props}/>);
            
        case "postit":
            return (<RoomFurnitureStickiesDialog {...props}/>);
            
        case "background_toner":
            return (<RoomFurnitureBackgroundTonerDialog {...props}/>);
            
        case "trophy":
            return (<RoomFurnitureTrophyDialog {...props}/>);

        case "stack_helper":
            return (<RoomFurnitureStackHelperDialog {...props}/>);

        case "wf_trg_says_something":
            return (<WiredTriggerSaysSomethingDialog {...props}/>);

        case "clothing":
        case "fx_box":
            return (<RoomFurnitureClothingDialog {...props}/>);
            
        case "mannequin":
            return (<RoomFurnitureMannequinDialog {...props}/>);

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

        case "wf_act_toggle_state":
            return (<WiredActionToggleStateDialog {...props}/>);

        case "wf_act_move_rotate":
            return (<WiredActionMoveRotateDialog {...props}/>);

        case "wf_act_toggle_to_rnd":
            return (<WiredActionToggleRandomStateDialog {...props}/>);

        case "wf_act_move_rotate_user":
            return (<WiredActionMoveRotateUserDialog {...props}/>);
        
        case "wf_act_match_to_sshot":
            return (<WiredActionMatchToPositionStateDialog {...props}/>);

        case "wf_trg_periodically":
            return (<WiredTriggerPeriodicallyDialog {...props}/>);

        case "wf_trg_period_short":
            return (<WiredTriggerPeriodicallyShortDialog {...props}/>);

        case "wf_trg_period_long":
            return (<WiredTriggerPeriodicallyLongDialog {...props}/>);

        case "wf_trg_user_performs_action":
            return (<WiredTriggerUserPerformsActionDialog {...props}/>);

        case "wf_trg_clock_counter":
            return (<WiredTriggerClockCounterDialog {...props}/>);

        case "wf_trg_at_given_time":
            return (<WiredTriggerAtGivenTimeDialog {...props}/>);

        case "wf_trg_score_achieved":
            return (<WiredTriggerScoreAchievedDialog {...props}/>);

        case "wf_trg_recv_signal":
        case "wf_act_send_signal":
            return (<WiredSignalDialog {...props}/>);
    }

    if(props.data.furnitureData.type.startsWith("wf_")) {
        return (
            <WiredDialog onClose={props.onClose}>
                <WiredFurniture furniture={props.data.furnitureData}/>

                <WiredDivider/>

                <WiredSection style={{ flexDirection: "row" }}>
                    <div style={{ flex: 1 }} />

                    <WiredButton onClick={props.onClose}>Cancel</WiredButton>
                </WiredSection>
            </WiredDialog>
        );
    }

    return null;
}