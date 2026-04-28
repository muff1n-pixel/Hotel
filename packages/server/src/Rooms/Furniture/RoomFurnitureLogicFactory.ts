import RoomFurniture from "./RoomFurniture";
import RoomFurnitureTeleportLogic from "./Logic/RoomFurnitureTeleportLogic.js";
import RoomFurnitureGateLogic from "./Logic/RoomFurnitureGateLogic.js";
import RoomFurnitureLightingLogic from "./Logic/RoomFurnitureLightingLogic.js";
import RoomFurnitureRollerLogic from "./Logic/RoomFurnitureRollerLogic.js";
import RoomFurnitureLogic from "./Logic/Interfaces/RoomFurnitureLogic.js";
import RoomFurnitureVendingMachineLogic from "./Logic/RoomFurnitureVendingMachineLogic.js";
import RoomFurnitureDiceLogic from "./Logic/RoomFurnitureDiceLogic.js";
import RoomFurnitureTeleportTileLogic from "./Logic/RoomFurnitureTeleportTileLogic.js";
import RoomFurnitureFortunaLogic from "./Logic/RoomFurnitureFortunaLogic.js";
import WiredTriggerUserSaysSomethingLogic from "./Logic/Wired/Trigger/WiredTriggerUserSaysSomethingLogic.js";
import WiredActionShowMessageLogic from "./Logic/Wired/Action/WiredActionShowMessageLogic.js";
import WiredActionTeleportToLogic from "./Logic/Wired/Action/WiredActionTeleportToLogic.js";
import WiredTriggerUserEntersRoomLogic from "./Logic/Wired/Trigger/WiredTriggerUserEntersRoomLogic.js";
import WiredTriggerUserWalksOnFurnitureLogic from "./Logic/Wired/Trigger/WiredTriggerUserWalksOnFurnitureLogic.js";
import WiredTriggerUserWalksOffFurnitureLogic from "./Logic/Wired/Trigger/WiredTriggerUserWalksOffFurnitureLogic.js";
import WiredTriggerStateChangedLogic from "./Logic/Wired/Trigger/WiredTriggerStateChangedLogic.js";
import WiredTriggerStuffStateLogic from "./Logic/Wired/Trigger/WiredTriggerStuffStateLogic.js";
import WiredTriggerUserLeavesRoomLogic from "./Logic/Wired/Trigger/WiredTriggerUserLeavesRoomLogic.js";
import WiredTriggerUserClickFurniLogic from "./Logic/Wired/Trigger/WiredTriggerUserClickFurniLogic.js";
import WiredTriggerUserClickUserLogic from "./Logic/Wired/Trigger/WiredTriggerUserClickUserLogic.js";
import WiredTriggerUserClickTileLogic from "./Logic/Wired/Trigger/WiredTriggerUserClickTileLogic.js";
import RoomInvisibleFurnitureControlLogic from "./Logic/RoomInvisibleFurnitureControlLogic.js";
import WiredTriggerPeriodicallyLogic from "./Logic/Wired/Trigger/WiredTriggerPeriodicallyLogic.js";
import WiredTriggerUserPerformsActionLogic from "./Logic/Wired/Trigger/WiredTriggerUserPerformsActionLogic.js";
import WiredTriggerCollisionLogic from "./Logic/Wired/Trigger/WiredTriggerCollisionLogic.js";
import WiredActionSendSignalLogic from "./Logic/Wired/Action/WiredActionSendSignalLogic.js";
import WiredTriggerReceiveSignalLogic from "./Logic/Wired/Trigger/WiredTriggerReceiveSignalLogic.js";
import RoomFurnitureCrackableLogic from "./Logic/RoomFurnitureCrackableLogic.js";
import RoomFurnitureFreezeGateLogic from "./Logic/Games/Freeze/Common/RoomFurnitureFreezeGateLogic";
import RoomFurnitureIceTagFieldLogic from "./Logic/Games/IceTag/RoomFurnitureIceTagFieldLogic";
import RoomFurnitureIceTagPoleLogic from "./Logic/Games/IceTag/RoomFurnitureIceTagPoleLogic";
import RoomFurnitureFootballLogic from "./Logic/Games/RoomFurnitureFootballLogic";
import RoomFurnitureBunnyRunFieldLogic from "./Logic/Games/BunnyRun/RoomFurnitureBunnyRunFieldLogic";
import RoomFurnitureBunnyRunPoleLogic from "./Logic/Games/BunnyRun/RoomFurnitureBunnyRunPoleLogic";
import RoomFurnitureFreezeTileLogic from "./Logic/Games/Freeze/RoomFurnitureFreezeTileLogic";
import RoomFurnitureFreezeBlockLogic from "./Logic/Games/Freeze/RoomFurnitureFreezeBlockLogic";
import RoomFurnitureFreezeExitLogic from "./Logic/Games/Freeze/RoomFurnitureFreezeExitLogic";
import RoomFurnitureFreezeCounterLogic from "./Logic/Games/Freeze/RoomFurnitureFreezeCounterLogic";
import RoomFurnitureTrapLogic from "./Logic/RoomFurnitureTrapLogic";
import RoomFurniturePhotostandLogic from "./Logic/RoomFurniturePhotostandLogic";
import RoomFurnitureStackHelperLogic from "./Logic/RoomFurnitureStackHelperLogic";
import RoomFurnitureBattleBanzaiRandomTeleportLogic from "./Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiRandomTeleportLogic";
import RoomFurnitureFreezeTimerLogic from "./Logic/Games/Freeze/Common/RoomFurnitureFreezeTimerLogic";
import RoomFurnitureBattleBanzaiTimerLogic from "./Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiTimerLogic";
import RoomFurnitureBattleBanzaiGateLogic from "./Logic/Games/BattleBanzai/Common/RoomFurnitureBattleBanzaiGateLogic";
import RoomFurnitureBattleBanzaiSphereLogic from "./Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiSphereLogic";
import RoomFurnitureBattleBanzaiTileLogic from "./Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiTileLogic";
import RoomFurnitureBattleBanzaiCounterLogic from "./Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiCounterLogic";
import RoomFurnitureBattleBanzaiPuckLogic from "./Logic/Games/BattleBanzai/RoomFurnitureBattleBanzaiPuckLogic";
import RoomFurnitureSkateRailLogic from "./Logic/Games/Skateboarding/RoomFurnitureSkateRailLogic";
import RoomFurnitureSnowboardRailLogic from "./Logic/Games/Snowboarding/RoomFurnitureSnowboardRailLogic";
import RoomFurnitureSnowboardRampLogic from "./Logic/Games/Snowboarding/RoomFurnitureSnowboardRampLogic";
import RoomFurnitureClothingLogic from "./Logic/RoomFurnitureClothingLogic";
import RoomFurnitureEnableBoxLogic from "./Logic/RoomFurnitureEnableBoxLogic";
import RoomFurnitureTraxLogic from "./Logic/RoomFurnitureTraxLogic";
import WiredTriggerClockCounterLogic from "./Logic/Wired/Trigger/WiredTriggerClockCounterLogic";
import WiredTriggerAtGivenTimeLogic from "./Logic/Wired/Trigger/WiredTriggerAtGivenTimeLogic";
import WiredTriggerGameEndsLogic from "./Logic/Wired/Trigger/WiredTriggerGameEndsLogic";
import WiredTriggerGameStartsLogic from "./Logic/Wired/Trigger/WiredTriggerGameStartsLogic";
import WiredTriggerScoreAchievedLogic from "./Logic/Wired/Trigger/WiredTriggerScoreAchievedLogic";
import WiredActionToggleStateLogic from "./Logic/Wired/Action/WiredActionToggleStateLogic";
import WiredActionMoveRotateLogic from "./Logic/Wired/Action/WiredActionMoveRotateLogic";
import WiredActionMoveRotateUserLogic from "./Logic/Wired/Action/WiredActionMoveRotateUserLogic";

export default class RoomFurnitureLogicFactory {
    public static getLogic(roomFurniture: RoomFurniture): RoomFurnitureLogic | null {
        switch(roomFurniture.model.furniture.interactionType) {
            case "dice":
                return new RoomFurnitureDiceLogic(roomFurniture);

            case "teleport":
                return new RoomFurnitureTeleportLogic(roomFurniture);

            case "teleporttile":
                return new RoomFurnitureTeleportTileLogic(roomFurniture);

            case "gate":
                return new RoomFurnitureGateLogic(roomFurniture);
            
            case "default":
            case "multiheight":
                return new RoomFurnitureLightingLogic(roomFurniture);
                
            case "crackable":
                return new RoomFurnitureCrackableLogic(roomFurniture);
            
            case "vendingmachine":
                return new RoomFurnitureVendingMachineLogic(roomFurniture);

            case "roller":
                return new RoomFurnitureRollerLogic(roomFurniture);

            case "fortuna":
                return new RoomFurnitureFortunaLogic(roomFurniture);

            case "trap":
                return new RoomFurnitureTrapLogic(roomFurniture);

            case "photostand":
                return new RoomFurniturePhotostandLogic(roomFurniture);

            case "stack_helper":
                return new RoomFurnitureStackHelperLogic(roomFurniture);

            case "clothing":
                return new RoomFurnitureClothingLogic(roomFurniture);

            case "fx_box":
                return new RoomFurnitureEnableBoxLogic(roomFurniture);

            case "trax":
                return new RoomFurnitureTraxLogic(roomFurniture);

            // Skateboarding
            case "skate_rail":
                return new RoomFurnitureSkateRailLogic(roomFurniture);

            // Snowboarding
            case "snowboard_rail":
                return new RoomFurnitureSnowboardRailLogic(roomFurniture);

            case "snowboard_ramp":
                return new RoomFurnitureSnowboardRampLogic(roomFurniture);

            // Ice Tag
            case "icetag_field":
                return new RoomFurnitureIceTagFieldLogic(roomFurniture);

            case "icetag_pole":
                return new RoomFurnitureIceTagPoleLogic(roomFurniture);

            // Football
            case "football":
                return new RoomFurnitureFootballLogic(roomFurniture);

            // Bunny Run
            case "bunnyrun_field":
                return new RoomFurnitureBunnyRunFieldLogic(roomFurniture);

            case "bunnyrun_pole":
                return new RoomFurnitureBunnyRunPoleLogic(roomFurniture);

            // Freeze
            case "freeze_timer":
                return new RoomFurnitureFreezeTimerLogic(roomFurniture);

            case "freeze_gate_blue":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "blue");

            case "freeze_gate_green":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "green");

            case "freeze_gate_red":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "red");

            case "freeze_gate_yellow":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "yellow");

            case "freeze_tile":
                return new RoomFurnitureFreezeTileLogic(roomFurniture);

            case "freeze_block":
                return new RoomFurnitureFreezeBlockLogic(roomFurniture);

            case "freeze_exit":
                return new RoomFurnitureFreezeExitLogic(roomFurniture);

            case "freeze_counter_blue":
                return new RoomFurnitureFreezeCounterLogic(roomFurniture, "blue");

            case "freeze_counter_green":
                return new RoomFurnitureFreezeCounterLogic(roomFurniture, "green");

            case "freeze_counter_red":
                return new RoomFurnitureFreezeCounterLogic(roomFurniture, "red");

            case "freeze_counter_yellow":
                return new RoomFurnitureFreezeCounterLogic(roomFurniture, "yellow");

            // Battle Banzai
            case "battlebanzai_timer":
                return new RoomFurnitureBattleBanzaiTimerLogic(roomFurniture);

            case "battlebanzai_random_teleport":
                return new RoomFurnitureBattleBanzaiRandomTeleportLogic(roomFurniture);

            case "battlebanzai_sphere":
                return new RoomFurnitureBattleBanzaiSphereLogic(roomFurniture);

            case "battlebanzai_tile":
                return new RoomFurnitureBattleBanzaiTileLogic(roomFurniture);

            case "battlebanzai_puck":
                return new RoomFurnitureBattleBanzaiPuckLogic(roomFurniture);

            case "battlebanzai_gate_blue":
                return new RoomFurnitureBattleBanzaiGateLogic(roomFurniture, "blue");

            case "battlebanzai_gate_green":
                return new RoomFurnitureBattleBanzaiGateLogic(roomFurniture, "green");

            case "battlebanzai_gate_red":
                return new RoomFurnitureBattleBanzaiGateLogic(roomFurniture, "red");

            case "battlebanzai_gate_yellow":
                return new RoomFurnitureBattleBanzaiGateLogic(roomFurniture, "yellow");

            case "battlebanzai_counter_blue":
                return new RoomFurnitureBattleBanzaiCounterLogic(roomFurniture, "blue");

            case "battlebanzai_counter_green":
                return new RoomFurnitureBattleBanzaiCounterLogic(roomFurniture, "green");

            case "battlebanzai_counter_red":
                return new RoomFurnitureBattleBanzaiCounterLogic(roomFurniture, "red");

            case "battlebanzai_counter_yellow":
                return new RoomFurnitureBattleBanzaiCounterLogic(roomFurniture, "yellow");

            // Wired
            case "conf_invis_control":
                return new RoomInvisibleFurnitureControlLogic(roomFurniture);

            case "wf_trg_says_something":
                return new WiredTriggerUserSaysSomethingLogic(roomFurniture);

            case "wf_trg_enter_room":
                return new WiredTriggerUserEntersRoomLogic(roomFurniture);

            case "wf_trg_leave_room":
                return new WiredTriggerUserLeavesRoomLogic(roomFurniture);

            case "wf_trg_walks_on_furni":
                return new WiredTriggerUserWalksOnFurnitureLogic(roomFurniture);

            case "wf_trg_walks_off_furni":
                return new WiredTriggerUserWalksOffFurnitureLogic(roomFurniture);

            case "wf_trg_state_changed":
                return new WiredTriggerStateChangedLogic(roomFurniture);

            case "wf_trg_stuff_state":
                return new WiredTriggerStuffStateLogic(roomFurniture);

            case "wf_trg_click_furni":
                return new WiredTriggerUserClickFurniLogic(roomFurniture);

            case "wf_trg_click_user":
                return new WiredTriggerUserClickUserLogic(roomFurniture);

            case "wf_trg_click_tile":
                return new WiredTriggerUserClickTileLogic(roomFurniture);

            case "wf_trg_periodically":
            case "wf_trg_period_short":
            case "wf_trg_period_long":
                return new WiredTriggerPeriodicallyLogic(roomFurniture);

            case "wf_trg_user_performs_action":
                return new WiredTriggerUserPerformsActionLogic(roomFurniture);

            case "wf_trg_collision":
                return new WiredTriggerCollisionLogic(roomFurniture);

            case "wf_trg_recv_signal":
                return new WiredTriggerReceiveSignalLogic(roomFurniture);

            case "wf_trg_clock_counter":
                return new WiredTriggerClockCounterLogic(roomFurniture);

            case "wf_trg_at_given_time":
                return new WiredTriggerAtGivenTimeLogic(roomFurniture);

            case "wf_trg_game_starts":
                return new WiredTriggerGameStartsLogic(roomFurniture);

            case "wf_trg_game_ends":
                return new WiredTriggerGameEndsLogic(roomFurniture);

            case "wf_trg_score_achieved":
                return new WiredTriggerScoreAchievedLogic(roomFurniture);
                
            case "wf_act_show_message":
                return new WiredActionShowMessageLogic(roomFurniture);

            case "wf_act_teleport_to":
                return new WiredActionTeleportToLogic(roomFurniture);

            case "wf_act_send_signal":
                return new WiredActionSendSignalLogic(roomFurniture);

            case "wf_act_toggle_state":
                return new WiredActionToggleStateLogic(roomFurniture);

            case "wf_act_move_rotate":
                return new WiredActionMoveRotateLogic(roomFurniture);

            case "wf_act_move_rotate_user":
                return new WiredActionMoveRotateUserLogic(roomFurniture);
        }

        return null;
    }
}