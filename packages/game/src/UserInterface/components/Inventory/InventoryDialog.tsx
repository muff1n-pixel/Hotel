import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import InventoryBadgesTab from "./Tabs/InventoryBadgesTab";
import InventoryBotsTab from "./Tabs/InventoryBotsTab";
import InventoryFurnitureTab from "./Tabs/InventoryFurnitureTab";
import InventoryPetsTab from "./Tabs/InventoryPetsTab";

export type InventoryDialogProps = {
    hidden?: boolean;
    onClose: () => void;
};

export default function InventoryDialog({ hidden, onClose }: InventoryDialogProps) {
    return (
        <Dialog title="Inventory" width={500} height={340} hidden={hidden} onClose={onClose}>
            <DialogTabs withoutHeader tabs={[
                {
                    icon: "Furniture",
                    element: (<InventoryFurnitureTab/>)
                },
                {
                    icon: "Pets",
                    element: (<InventoryPetsTab/>)
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
