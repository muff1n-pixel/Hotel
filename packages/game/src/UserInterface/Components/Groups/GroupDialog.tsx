import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import GroupCard from "@UserInterface/Common/Groups/Card/GroupCard";
import useGroup from "@UserInterface/Hooks/useGroup";
import useUserGroup from "@UserInterface/Hooks/useUserGroup";

export type GroupDialogProps = {
    data?: string;
    hidden?: boolean;
    onClose?: () => void;
}

export default function GroupDialog({ data, hidden, onClose }: GroupDialogProps) {
    const group = useGroup(data);
    const userGroup = useUserGroup(data);

    return (
        <Dialog title="Habbo Group" hidden={hidden} onClose={onClose} initialPosition="center" width={360} height={240}>
            <DialogContent>
                <GroupCard data={group} userData={userGroup}/>
            </DialogContent>
        </Dialog>
    );
}
