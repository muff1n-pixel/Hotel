import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import GroupCard from "@UserInterface/Common/Groups/Card/GroupCard";
import useGroup from "@UserInterface/Hooks/useGroup";
import { useTranslation } from "react-i18next";

export type GroupDialogProps = {
    data?: string;
    hidden?: boolean;
    onClose?: () => void;
}

export default function GroupDialog({ data, hidden, onClose }: GroupDialogProps) {
    const group = useGroup(data);
    const [getTranslation] = useTranslation("groups");

    return (
        <Dialog title={getTranslation("title")} hidden={hidden} onClose={onClose} initialPosition="center" width={360} height={240}>
            <DialogContent>
                <GroupCard data={group}/>
            </DialogContent>
        </Dialog>
    );
}
