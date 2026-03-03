import DialogPanel from "../Dialog/Panels/DialogPanel";
import { useCallback, useEffect } from "react";
import ShopPage from "./Pages/ShopPage";
import { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import { useDialogs } from "../../hooks/useDialogs";
import ShopPagesList from "./ShopPagesList";
import { ShopPageData } from "@pixel63/events";
import DialogScrollArea from "../Dialog/Scroll/DialogScrollArea";

export type ShopDialogCategoryProps = {
    editMode?: boolean;
    onHeaderChange: (header: DialogTabHeaderProps) => void;

    shopPages: ShopPageData[];
    activeShopPage?: ShopPageData;
    setActiveShopPage: (page: { id: string; category: string; }) => void;
}

export default function ShopDialogCategory({ editMode, onHeaderChange, shopPages, activeShopPage, setActiveShopPage }: ShopDialogCategoryProps) {
    const dialogs = useDialogs();

    useEffect(() => {
        if(activeShopPage?.type === "none") {
            const childPages = shopPages.filter((shopPage) => shopPage.parentId === activeShopPage.id);

            if(childPages[0]) {
                setActiveShopPage(childPages[0]);

                return;
            }
        }

        onHeaderChange({
            title: activeShopPage?.title,
            description: activeShopPage?.description,

            iconImage: (activeShopPage?.icon)?(`./assets/shop/icons/${activeShopPage.icon}`):(undefined),
            backgroundImage: (activeShopPage?.header)?(`./assets/shop/headers/${activeShopPage.header}`):(undefined)
        });
    }, [ activeShopPage ]);

    const handleEditPage = useCallback((shopPage: ShopPageData) => {
        if(!editMode) {
            return;
        }

        dialogs.addUniqueDialog("edit-shop-page", {
            ...shopPage,
            shopPages
        });
    }, [editMode, shopPages, dialogs]);

    const handleCreatePage = useCallback((parentShopPage?: ShopPageData) => {
        dialogs.addUniqueDialog("edit-shop-page", {
            parentId: parentShopPage?.id
        });
    }, [dialogs]);

    return (
        <div style={{
            flex: "1 1 0",

            display: "flex",
            gap: 10,

            overflow: "hidden"
        }}>
            {(activeShopPage?.type !== "features") && (
                <div style={{ display: "flex", width: 190 }}>
                    <DialogPanel style={{ flex: 1 }} contentStyle={{ display: "flex" }}>
                        <DialogScrollArea style={{ gap: 1 }} hideInactive>
                            <ShopPagesList tabs={0} parentId={undefined} editMode={editMode} handleCreatePage={handleCreatePage} handleEditPage={handleEditPage} shopPages={shopPages} activeShopPage={activeShopPage} onPageChange={setActiveShopPage}/>

                            {(editMode) && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "flex-end",

                                    padding: 4
                                }}>
                                    <div className="sprite_add" style={{
                                        cursor: "pointer"
                                    }} onClick={() => handleCreatePage()}/>
                                </div>
                            )}
                        </DialogScrollArea>
                    </DialogPanel>
                </div>
            )}

            {(activeShopPage) && (<ShopPage editMode={editMode} page={activeShopPage} setActiveShopPage={setActiveShopPage}/>)}
        </div>
    );
}
