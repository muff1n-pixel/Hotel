import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type ModToolsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function ModToolsDialog({ hidden, onClose }: ModToolsDialogProps) {
    const dialogs = useDialogs();

    return (
        <Dialog title="Modtools" hidden={hidden} onClose={onClose} width={170} height={160}>
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <DialogButton onClick={() => dialogs.addUniqueDialog("furniture-browser")}>Furniture Browser</DialogButton>
                <DialogButton onClick={() => dialogs.addUniqueDialog("pet-browser")}>Pet Browser</DialogButton>
                <DialogButton onClick={() => dialogs.addUniqueDialog("badge-browser")}>Badge Browser</DialogButton>
            </DialogContent>
        </Dialog>
    );
}
