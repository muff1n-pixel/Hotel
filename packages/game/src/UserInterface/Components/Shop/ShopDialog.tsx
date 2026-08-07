import { useCallback, useEffect, useState } from "react";
import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs, { DialogTabHeaderProps } from "../../Common/Dialog/Components/Tabs/DialogTabs";
import ShopDialogCategory from "./ShopDialogCategory";
import { usePermissionAction } from "../../Hooks/usePermissionAction";
import { webSocketClient } from "../../..";
import { GetShopPagesData, ShopPageData, ShopPagesData } from "@pixel63/events";
import { useTranslation } from "react-i18next";

export type ShopDialogProps = {
    hidden?: boolean;
    data?: {
        requestedCategory?: string;

        requestedPage?: {
            id: string;
            category: string;
        };

        requestedFurnitureId?: string;
    };
    onClose?: () => void;
}

const categories = ["frontpage", "furniture", "clothing", "pets"];

export default function ShopDialog({ hidden, data, onClose }: ShopDialogProps) {
    const hasEditShopPermission = usePermissionAction("shop:edit");
    const [getTranslation] = useTranslation("shop");

    const [search, setSearch] = useState("");
    const [header, setHeader] = useState<DialogTabHeaderProps>();
    const [editMode, setEditMode] = useState(false);
    const [activeIndex, setActiveIndex] = useState(categories.indexOf(data?.requestedPage?.category ?? data?.requestedCategory ?? "frontpage"));

    const [activeShopPage, setActiveShopPage] = useState<ShopPageData>();
    const [requestedShopPage, setRequestedShopPage] = useState<{ id: string; category: string; } | undefined>(data?.requestedPage);
    const [shopPages, setShopPages] = useState<ShopPageData[]>([]);

    const onEditClick = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

    useEffect(() => {
        if(data?.requestedPage) {
            setRequestedShopPage(data.requestedPage);
        }
    }, [data?.requestedPage]);

    useEffect(() => {
        const category = categories.at(activeIndex);

        if(!category) {
            return;
        }

        const listener = webSocketClient.addProtobuffListener(ShopPagesData, {
            async handle(payload: ShopPagesData) {
                if(payload.category === category) {
                    setShopPages(payload.pages.sort((a, b) => {
                        if (a.index !== b.index) {
                            return a.index - b.index;
                        }

                        return a.title.localeCompare(b.title);
                    }));

                    if(!payload.search) {
                        if(requestedShopPage?.category === category) {
                            setActiveShopPage(payload.pages.find((shopPage) => shopPage.id === requestedShopPage.id));
                        }
                        else {
                            setActiveShopPage(payload.pages[0]);
                        }
                    }
                    else {
                        setActiveShopPage(ShopPageData.create({
                            id: "search",
                            category,

                            title: getTranslation("search.title", { search: payload.search }),

                            type: "default"
                        }));
                    }
                }
            },
        });

        webSocketClient.sendProtobuff(GetShopPagesData, GetShopPagesData.create({
            category
        }));

        return () => {
            webSocketClient.removeProtobuffListener(ShopPagesData, listener);
        };
    }, [activeIndex, requestedShopPage]);

    useEffect(() => {
        if(data?.requestedCategory) {
            setActiveIndex(categories.indexOf(data.requestedCategory));
        }
    }, [data?.requestedCategory])

    useEffect(() => {
        const category = categories.at(activeIndex);

        if(!category) {
            return;
        }

        webSocketClient.sendProtobuff(GetShopPagesData, GetShopPagesData.create({
            category,
            search
        }));
    }, [activeIndex, search]);

    // TODO: handle category and shop pages here
    const handleActiveShopPage = useCallback((shopPage: { id: string; category: string }) => {
        const category = categories.at(activeIndex);

        if(shopPage.category !== category) {
            setRequestedShopPage(shopPage);
            setActiveIndex(categories.indexOf(shopPage.category));
        }
        else {
            setActiveShopPage(shopPages.find((_shopPage) => _shopPage.id === shopPage.id));
        }
    }, [activeIndex, shopPages]);

    return (
        <Dialog title={getTranslation("title")} hidden={hidden} editMode={editMode} onEditClick={hasEditShopPermission && onEditClick} onClose={onClose} width={580} height={670}>
            <DialogTabs index={activeIndex} onChange={(index) => { setActiveIndex(index); setSearch(""); }} header={header} withLargeTabs tabs={[
                {
                    icon: getTranslation("tabs.frontpage"),
                    element: (
                        <ShopDialogCategory
                            category={categories[activeIndex]}
                            activeShopPage={activeShopPage}
                            setActiveShopPage={handleActiveShopPage}
                            search={search}
                            onSearchChange={setSearch}
                            shopPages={shopPages}
                            onHeaderChange={setHeader}
                            editMode={editMode}
                            requestedFurnitureId={data?.requestedFurnitureId}
                            />
                    ),
                },
                {
                    icon: getTranslation("tabs.furniture"),
                    element: (
                        <ShopDialogCategory
                            category={categories[activeIndex]}
                            activeShopPage={activeShopPage}
                            setActiveShopPage={handleActiveShopPage}
                            search={search}
                            onSearchChange={setSearch}
                            shopPages={shopPages}
                            onHeaderChange={setHeader}
                            editMode={editMode}
                            requestedFurnitureId={data?.requestedFurnitureId}
                            />
                    ),
                },
                {
                    icon: getTranslation("tabs.clothing"),
                    element: (
                        <ShopDialogCategory
                            category={categories[activeIndex]}
                            activeShopPage={activeShopPage}
                            setActiveShopPage={handleActiveShopPage}
                            search={search}
                            onSearchChange={setSearch}
                            shopPages={shopPages}
                            onHeaderChange={setHeader}
                            editMode={editMode}
                            requestedFurnitureId={data?.requestedFurnitureId}
                            />
                    ),
                },
                {
                    icon: getTranslation("tabs.pets"),
                    element: (
                        <ShopDialogCategory
                            category={categories[activeIndex]}
                            activeShopPage={activeShopPage}
                            setActiveShopPage={handleActiveShopPage}
                            search={search}
                            onSearchChange={setSearch}
                            shopPages={shopPages}
                            onHeaderChange={setHeader}
                            editMode={editMode}
                            requestedFurnitureId={data?.requestedFurnitureId}
                            />
                    ),
                }
            ]}>

            </DialogTabs>
        </Dialog>
    );
}
