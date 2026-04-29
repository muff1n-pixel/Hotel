import { clientInstance } from "../../..";
import { useSettings } from "../../Hooks2/useSettings";
import Dialog from "../../Common/Dialog/Dialog";
import DialogContent from "../../Common/Dialog/Components/DialogContent";
import Checkbox from "../../Common/Form/Components/Checkbox";

export type SettingsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function SettingsDialog({ hidden, onClose }: SettingsDialogProps) {
    const settings = useSettings();

    return (
        <Dialog title="Settings" hidden={hidden} onClose={onClose} width={300} height={120} initialPosition="center">
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
                    
                    <Checkbox value={settings?.hideTooltips === true} onChange={() => {
                        clientInstance.settings.value!.hideTooltips = !settings?.hideTooltips;
                        clientInstance.settings.update();
                    }} label="Hide tooltips"/>
                    
                    <Checkbox value={settings?.debugRoomRendering === true} onChange={() => {
                        clientInstance.settings.value!.debugRoomRendering = !settings?.debugRoomRendering;
                        clientInstance.settings.update();
                    }} label="Debug room rendering"/>
                </div>
            </DialogContent>
        </Dialog>
    );
}
