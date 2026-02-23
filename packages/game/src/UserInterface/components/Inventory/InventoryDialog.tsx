import Dialog from "../Dialog/Dialog";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import InventoryBadgesTab from "./Tabs/InventoryBadgesTab";
import InventoryBotsTab from "./Tabs/InventoryBotsTab";
import InventoryEmptyTab from "./Tabs/InventoryEmptyTab";
import InventoryFurnitureTab from "./Tabs/InventoryFurnitureTab";

export type InventoryDialogProps = {
    hidden?: boolean;
    onClose: () => void;
};

export default function InventoryDialog({ hidden, onClose }: InventoryDialogProps) {
    return (
        <Dialog title="Inventory" width={490} height={340} hidden={hidden} onClose={onClose}>
            <DialogTabs withoutHeader tabs={[
                {
                    icon: "Furniture",
                    element: (<InventoryFurnitureTab/>)
                },
                {
                    icon: "Pets",
                    element: (<InventoryEmptyTab/>)
                },
                {
                    icon: "Badges",
                    element: (<InventoryBadgesTab/>)
                },
                {
                    icon: "Bots",
                    element: (<InventoryBotsTab/>)
                }
            ]}/>
        </Dialog>
    );
}
