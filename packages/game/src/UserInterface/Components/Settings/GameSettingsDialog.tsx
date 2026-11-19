import { clientInstance } from "../../..";
import { useSettings } from "../../Hooks/useSettings";
import Dialog from "../../Common/Dialog/Dialog";
import DialogContent from "../../Common/Dialog/Components/DialogContent";
import Checkbox from "../../Common/Form/Components/Checkbox";
import { useTranslation } from "react-i18next";

export type GameSettingsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function GameSettingsDialog({ hidden, onClose }: GameSettingsDialogProps) {
    const settings = useSettings();
    const [getTranslation] = useTranslation("settings");

    return (
        <Dialog title={getTranslation("game.title")} hidden={hidden} onClose={onClose} width={300} height={"auto"} assumedHeight={180} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <Checkbox value={settings?.limitRoomFrames === true} onChange={() => {
                        clientInstance.settings.value!.limitRoomFrames = !settings?.limitRoomFrames;
                        clientInstance.settings.update();
                    }} label={getTranslation("game.limit_frame_rate")}/>

                    <Checkbox value={settings?.autoScaleRooms === true} onChange={() => {
                        clientInstance.settings.value!.autoScaleRooms = !settings?.autoScaleRooms;
                        clientInstance.settings.update();
                    }} label={getTranslation("game.auto_scale_rooms")}/>
                    
                    <Checkbox value={settings?.hideTooltips === true} onChange={() => {
                        clientInstance.settings.value!.hideTooltips = !settings?.hideTooltips;
                        clientInstance.settings.update();
                    }} label={getTranslation("game.hide_tooltips")}/>
                    
                    <Checkbox value={settings?.disablePurchaseConfirmation === true} onChange={() => {
                        clientInstance.settings.value!.disablePurchaseConfirmation = !settings?.disablePurchaseConfirmation;
                        clientInstance.settings.update();
                    }} label={getTranslation("game.disable_purchase_confirmations")}/>
                    
                    <Checkbox value={settings?.debugRoomRendering === true} onChange={() => {
                        clientInstance.settings.value!.debugRoomRendering = !settings?.debugRoomRendering;
                        clientInstance.settings.update();
                    }} label={getTranslation("game.debug_room_rendering")}/>
                    
                    <Checkbox value={settings?.debugRoomLandscapes === true} onChange={() => {
                        clientInstance.settings.value!.debugRoomLandscapes = !settings?.debugRoomLandscapes;
                        clientInstance.settings.update();
                    }} label={getTranslation("game.debug_room_landscape")}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}
