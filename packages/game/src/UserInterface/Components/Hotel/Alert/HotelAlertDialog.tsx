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
        <Dialog title="Notice!" hidden={hidden} onClose={onClose} width={276} height={138} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,
                    textAlign: "center"
                }}>
                    {data?.message}
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <DialogButton onClick={onClose}>
                        Close
                    </DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
