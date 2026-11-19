import DialogPanel from "../../Common/Dialog/Components/Panels/DialogPanel";
import { useCallback, useEffect, useState } from "react";
import ShopPage from "./Pages/ShopPage";
import { DialogTabHeaderProps } from "../../Common/Dialog/Components/Tabs/DialogTabs";
import { useDialogs } from "../../Hooks/useDialogs";
import ShopPagesList from "./ShopPagesList";
import { ShopPageData } from "@pixel63/events";
import DialogScrollArea from "../../Common/Dialog/Components/Scroll/DialogScrollArea";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useTranslation } from "react-i18next";

export type ShopDialogCategoryProps = {
    category: string;

    editMode?: boolean;
    onHeaderChange: (header: DialogTabHeaderProps) => void;

    shopPages: ShopPageData[];
    activeShopPage?: ShopPageData;
    
    search: string;
    setActiveShopPage: (page: { id: string; category: string; }) => void;

    onSearchChange: (search: string) => void;

    requestedFurnitureId?: string;
}

export default function ShopDialogCategory({ category, editMode, onHeaderChange, shopPages, activeShopPage, setActiveShopPage, search, onSearchChange, requestedFurnitureId }: ShopDialogCategoryProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");
    const [searchText, setSearchText] = useState("");

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
            shopPages,
            category
        });
    }, [editMode, shopPages, dialogs, category]);

    const handleCreatePage = useCallback((parentShopPage?: ShopPageData) => {
        dialogs.addUniqueDialog("edit-shop-page", {
            parentId: parentShopPage?.id,
            category
        });
    }, [dialogs, category]);

    return (
        <div style={{
            flex: "1 1 0",

            display: "flex",
            gap: 10,

            overflow: "hidden"
        }}>
            {(activeShopPage?.type !== "features") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 190 }}>
                    <Input placeholder={getTranslation("search.placeholder")} value={searchText} onChange={setSearchText} onSubmit={onSearchChange}>
                        <div className="sprite_room_user_motto_pen"/>
                    </Input>

                    <DialogPanel style={{ flex: 1, overflow: "hidden" }} contentStyle={{ display: "flex" }}>
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

            {(activeShopPage) && (<ShopPage search={search} editMode={editMode} page={activeShopPage} setActiveShopPage={setActiveShopPage} requestedFurnitureId={requestedFurnitureId}/>)}
        </div>
    );
}
