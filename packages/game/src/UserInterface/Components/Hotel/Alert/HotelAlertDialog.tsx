import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";

export type HotelAlertDialogProps = {
    data?: any;
    hidden?: boolean;
    onClose?: () => void;
}

export default function HotelAlertDialog({ hidden, data, onClose }: HotelAlertDialogProps) {
    return (
        <Dialog title="Alert" hidden={hidden} onClose={onClose} width={300} height={180} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                }}>
                    {data?.message}
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <DialogButton onClick={onClose}>
                        Close
                    </DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
