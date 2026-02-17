import { useCallback, useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogTabs, { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import ShopDialogCategory from "./ShopDialogCategory";
import { usePermissionAction } from "../../hooks/usePermissionAction";

export type ShopDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function ShopDialog({ hidden, onClose }: ShopDialogProps) {
    const hasEditShopPermission = usePermissionAction("shop:edit");

    const [header, setHeader] = useState<DialogTabHeaderProps>();
    const [editMode, setEditMode] = useState(false);

    const onEditClick = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

    return (
        <Dialog title="Shop" hidden={hidden} onEditClick={hasEditShopPermission && onEditClick} onClose={onClose} width={570} height={670}>
            <DialogTabs initialActiveIndex={1} header={header} withLargeTabs tabs={[
                {
                    icon: "Frontpage",
                    element: (<div/>),
                },
                {
                    icon: "Furniture",
                    element: (
                        <ShopDialogCategory category="furniture" onHeaderChange={setHeader} editMode={editMode}/>
                    ),
                },
                {
                    icon: "Clothing",
                    element: (<div/>),
                },
                {
                    icon: "Pets",
                    element: (<div/>),
                }
            ]}>

            </DialogTabs>
        </Dialog>
    );
}
