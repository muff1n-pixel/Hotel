import { clientInstance } from "../../..";
import { useSettings } from "../../Hooks/useSettings";
import Dialog from "../../Common/Dialog/Dialog";
import DialogContent from "../../Common/Dialog/Components/DialogContent";
import Checkbox from "../../Common/Form/Components/Checkbox";

export type GameSettingsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function GameSettingsDialog({ hidden, onClose }: GameSettingsDialogProps) {
    const settings = useSettings();

    return (
        <Dialog title="Game Settings" hidden={hidden} onClose={onClose} width={300} height={"auto"} assumedHeight={180} initialPosition="center">
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
                    }} label="Limit frame rate to 60 fps"/>

                    <Checkbox value={settings?.autoScaleRooms === true} onChange={() => {
                        clientInstance.settings.value!.autoScaleRooms = !settings?.autoScaleRooms;
                        clientInstance.settings.update();
                    }} label="Automatically scale rooms"/>
                    
                    <Checkbox value={settings?.hideTooltips === true} onChange={() => {
                        clientInstance.settings.value!.hideTooltips = !settings?.hideTooltips;
                        clientInstance.settings.update();
                    }} label="Hide tooltips"/>
                    
                    <Checkbox value={settings?.disablePurchaseConfirmation === true} onChange={() => {
                        clientInstance.settings.value!.disablePurchaseConfirmation = !settings?.disablePurchaseConfirmation;
                        clientInstance.settings.update();
                    }} label="Disable purchase confirmations"/>
                    
                    <Checkbox value={settings?.debugRoomRendering === true} onChange={() => {
                        clientInstance.settings.value!.debugRoomRendering = !settings?.debugRoomRendering;
                        clientInstance.settings.update();
                    }} label="Debug room rendering"/>
                    
                    <Checkbox value={settings?.debugRoomLandscapes === true} onChange={() => {
                        clientInstance.settings.value!.debugRoomLandscapes = !settings?.debugRoomLandscapes;
                        clientInstance.settings.update();
                    }} label="Debug room landscape"/>
                </div>
            </DialogContent>
        </Dialog>
    );
}
