import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { HotelAlertData } from "@pixel63/events";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import { useTranslation } from "react-i18next";

const backgroundImage = new URL('../../../Images/dialog/background-red.png', import.meta.url).toString();
const iconImage = new URL('../../../Images/dialog/password-error.png', import.meta.url).toString();

export type RoomPasswordErrorDialogProps = {
    data?: HotelAlertData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomPasswordErrorDialog({ data, hidden, onClose }: RoomPasswordErrorDialogProps) {
    const [getTranslation] = useTranslation("room");
    return (
        <Dialog title={getTranslation("doorbell.title")} hidden={hidden} onClose={onClose} width={360} height={190}>
            <DialogHeaderContent header={{
                backgroundImage,
                iconImage,

                title: getTranslation("doorbell.oops"),
                description: data?.message
            }}/>

            <DialogContent style={{
                alignItems: "flex-end"
            }}>
                <DialogButton onClick={onClose}>{getTranslation("doorbell.close")}</DialogButton>
            </DialogContent>
        </Dialog>
    );
}
