import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import InventoryBadgesTab from "./Tabs/InventoryBadgesTab";
import InventoryBotsTab from "./Tabs/InventoryBotsTab";
import InventoryFurnitureTab from "./Tabs/InventoryFurnitureTab";
import InventoryPetsTab from "./Tabs/InventoryPetsTab";

export type InventoryDialogProps = {
    data?: {
        tab?: string;
    };
    hidden?: boolean;
    onClose: () => void;
};

export default function InventoryDialog({ data, hidden, onClose }: InventoryDialogProps) {
    return (
        <Dialog title="Inventory" width={500} height={340} hidden={hidden} onClose={onClose}>
            <DialogTabs initialActiveIndex={["furniture", "pets", "badges", "bots"].indexOf(data?.tab ?? "furniture")} withoutHeader tabs={[
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
