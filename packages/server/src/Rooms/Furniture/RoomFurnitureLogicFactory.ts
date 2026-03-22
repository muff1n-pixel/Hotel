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
import RoomFurnitureFreezeGateLogic from "./Logic/Games/Freeze/RoomFurnitureFreezeGateLogic";
import RoomFurnitureIceTagFieldLogic from "./Logic/Games/IceTag/RoomFurnitureIceTagFieldLogic";
import RoomFurnitureIceTagPoleLogic from "./Logic/Games/IceTag/RoomFurnitureIceTagPoleLogic";
import RoomFurnitureFootballLogic from "./Logic/Games/RoomFurnitureFootballLogic";
import RoomFurnitureBunnyRunFieldLogic from "./Logic/Games/BunnyRun/RoomFurnitureBunnyRunFieldLogic";
import RoomFurnitureBunnyRunPoleLogic from "./Logic/Games/BunnyRun/RoomFurnitureBunnyRunPoleLogic";
import RoomFurnitureGameTimerLogic from "./Logic/Games/RoomFurnitureGameTimerLogic";

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
            case "freeze_gate_blue":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "blue");

            case "freeze_gate_green":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "green");

            case "freeze_gate_red":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "red");

            case "freeze_gate_yellow":
                return new RoomFurnitureFreezeGateLogic(roomFurniture, "yellow");

            // Game
            case "game_timer":
                return new RoomFurnitureGameTimerLogic(roomFurniture);

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
                
            case "wf_act_show_message":
                return new WiredActionShowMessageLogic(roomFurniture);

            case "wf_act_teleport_to":
                return new WiredActionTeleportToLogic(roomFurniture);

            case "wf_act_send_signal":
                return new WiredActionSendSignalLogic(roomFurniture);

            case "wf_trg_recv_signal":
                return new WiredTriggerReceiveSignalLogic(roomFurniture);
        }

        return null;
    }
}