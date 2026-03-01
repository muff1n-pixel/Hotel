import { useCallback, useEffect, useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogTabs, { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import ShopDialogCategory from "./ShopDialogCategory";
import { usePermissionAction } from "../../hooks/usePermissionAction";
import { webSocketClient } from "../../..";
import { GetShopPagesEventData, ShopPageCategory } from "@Shared/Communications/Requests/Shop/GetShopPagesEventData";
import { ShopPageData, ShopPagesData } from "@pixel63/events";

export type ShopDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

const categories = ["frontpage", "furniture", "clothing", "pets"] satisfies ShopPageCategory[];

export default function ShopDialog({ hidden, onClose }: ShopDialogProps) {
    const hasEditShopPermission = usePermissionAction("shop:edit");

    const [header, setHeader] = useState<DialogTabHeaderProps>();
    const [editMode, setEditMode] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const [activeShopPage, setActiveShopPage] = useState<ShopPageData>();
    const [requestedShopPage, setRequestedShopPage] = useState<{ id: string; category: ShopPageCategory; }>();
    const [shopPages, setShopPages] = useState<ShopPageData[]>([]);

    const onEditClick = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

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

                    if(requestedShopPage?.category === category) {
                        setActiveShopPage(shopPages.find((shopPage) => shopPage.id === requestedShopPage.id));
                    }
                    else {
                        setActiveShopPage(payload.pages[0]);
                    }
                }
            },
        });

        webSocketClient.send<GetShopPagesEventData>("GetShopPagesEvent", {
            category
        });

        return () => {
            webSocketClient.removeProtobuffListener(ShopPagesData, listener);
        };
    }, [activeIndex, requestedShopPage]);

    // TODO: handle category and shop pages here
    const handleActiveShopPage = useCallback((shopPage: { id: string; category: ShopPageCategory }) => {
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
        <Dialog title="Shop" hidden={hidden} onEditClick={hasEditShopPermission && onEditClick} onClose={onClose} width={570} height={670}>
            <DialogTabs index={activeIndex} onChange={setActiveIndex} header={header} withLargeTabs tabs={[
                {
                    icon: "Frontpage",
                    element: (
                        <ShopDialogCategory activeShopPage={activeShopPage} setActiveShopPage={handleActiveShopPage} shopPages={shopPages} onHeaderChange={setHeader} editMode={editMode}/>
                    ),
                },
                {
                    icon: "Furniture",
                    element: (
                        <ShopDialogCategory activeShopPage={activeShopPage} setActiveShopPage={handleActiveShopPage} shopPages={shopPages} onHeaderChange={setHeader} editMode={editMode}/>
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
