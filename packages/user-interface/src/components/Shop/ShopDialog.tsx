import Dialog from "../Dialog/Dialog";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import ShopDialogCategory from "./ShopDialogCategory";

export type ShopDialogProps = {
    onClose?: () => void;
}

export default function ShopDialog({ onClose }: ShopDialogProps) {

    return (
        <Dialog title="Shop" onClose={onClose} width={570} height={670}>
            <DialogTabs initialActiveIndex={1} withLargeTabs tabs={[
                {
                    icon: "Frontpage",
                    header: (<div/>),
                    element: (<div/>),
                },
                {
                    icon: "Furniture",
                    header: (
                        <h2>Furniture</h2>
                    ),
                    element: (
                        <ShopDialogCategory category="furniture"/>
                    ),
                },
                {
                    icon: "Clothing",
                    header: (<div/>),
                    element: (<div/>),
                },
                {
                    icon: "Pets",
                    header: (<div/>),
                    element: (<div/>),
                }
            ]}>

            </DialogTabs>
        </Dialog>
    );
}
