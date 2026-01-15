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
                    element: (<div/>),
                },
                {
                    icon: "Furniture",
                    header: {
                        label: "Furniture",
                        description: "lalalallalalala",
                        iconImage: "./assets/shop/icons/icon_1.png",
                        backgroundImage: "./assets/shop/headers/catalog_frontpage_headline_shop_EN.gif"
                    },
                    element: (
                        <ShopDialogCategory category="furniture"/>
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
