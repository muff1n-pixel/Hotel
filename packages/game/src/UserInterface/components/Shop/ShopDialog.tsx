import { useCallback, useEffect, useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogTabs, { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import ShopDialogCategory from "./ShopDialogCategory";
import { usePermissionAction } from "../../hooks/usePermissionAction";
import { ShopPageData, ShopPagesEventData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { webSocketClient } from "../../..";
import { GetShopPagesEventData, ShopPageCategory } from "@Shared/Communications/Requests/Shop/GetShopPagesEventData";

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

        const listener = (event: WebSocketEvent<ShopPagesEventData>) => {
            if(event.data.category === category) {
                setShopPages(event.data.pages);

                if(requestedShopPage?.category === category) {
                    for(const page of event.data.pages) {
                        if(page.id === requestedShopPage.id) {
                            setActiveShopPage(page);

                            break;
                        }

                        if(page.children) {
                            for(const child of page.children) {
                                if(child.id === requestedShopPage.id) {
                                    setActiveShopPage(child);

                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    setActiveShopPage(event.data.pages[0]);
                }
            }
        }

        webSocketClient.addEventListener<WebSocketEvent<ShopPagesEventData>>("ShopPagesEventData", listener);

        webSocketClient.send<GetShopPagesEventData>("GetShopPagesEvent", {
            category
        });

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<ShopPagesEventData>>("ShopPagesEventData", listener);
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
            for(const page of shopPages) {
                if(page.id === shopPage.id) {
                    setActiveShopPage(page);

                    break;
                }

                if(page.children) {
                    for(const child of page.children) {
                        if(child.id === shopPage.id) {
                            setActiveShopPage(child);

                            break;
                        }
                    }
                }
            }
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
