import { clientInstance } from "../../..";
import { useSettings } from "../../hooks/useSettings";
import Dialog from "../Dialog/Dialog";
import DialogContent from "../Dialog/DialogContent";
import Checkbox from "../Form/Checkbox";

export type SettingsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function SettingsDialog({ hidden, onClose }: SettingsDialogProps) {
    const settings = useSettings();

    return (
        <Dialog title="Settings" hidden={hidden} onClose={onClose} width={300} height={70} initialPosition="center">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
