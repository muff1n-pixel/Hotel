import DialogPanel from "../Dialog/Panels/DialogPanel";
import DialogPanelList from "../Dialog/Panels/DialogPanelList";
import DialogPanelListItem from "../Dialog/Panels/DialogPanelListItem";
import { Fragment, useCallback, useEffect, useState } from "react";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import ShopPage from "./Pages/ShopPage";
import { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import { webSocketClient } from "../../..";
import { ShopPageData, ShopPagesEventData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import { GetShopPagesEventData } from "@Shared/Communications/Requests/Shop/GetShopPagesEventData";
import { useUser } from "../../hooks/useUser";
import { useDialogs } from "../../hooks/useDialogs";

export type ShopDialogCategoryProps = {
    category: "frontpage" | "furniture" | "clothing" | "pets";
    onHeaderChange: (header: DialogTabHeaderProps) => void;
}

export default function ShopDialogCategory({ category, onHeaderChange }: ShopDialogCategoryProps) {
    const user = useUser();
    const dialogs = useDialogs();

    const [activeShopPage, setActiveShopPage] = useState<ShopPageData>();

    const [shopPages, setShopPages] = useState<ShopPageData[]>([]);

    useEffect(() => {
        const listener = (event: WebSocketEvent<ShopPagesEventData>) => {
            if(event.data.category === category) {
                setShopPages(event.data.pages);
                setActiveShopPage(event.data.pages[0]);
            }
        }

        webSocketClient.addEventListener<WebSocketEvent<ShopPagesEventData>>("ShopPagesEventData", listener);

        webSocketClient.send<GetShopPagesEventData>("GetShopPagesEvent", {
            category
        });

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<ShopPagesEventData>>("ShopPagesEventData", listener);
        };
    }, []);

    useEffect(() => {
        if(activeShopPage?.type === "none") {
            const childPage = activeShopPage.children?.[0];

            if(childPage) {
                setActiveShopPage(childPage);

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

    const handleEditPage = useCallback((shopPage: ShopPageData & { parent?: ShopPageData }) => {
        if(!user?.developer) {
            return;
        }

        dialogs.addUniqueDialog("edit-shop-page", shopPage);
    }, [user, dialogs]);

    const handleCreatePage = useCallback((parentShopPage?: ShopPageData) => {
        dialogs.addUniqueDialog("edit-shop-page", {
            parent: parentShopPage
        });
    }, [dialogs]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            gap: 10
        }}>
            <div style={{ display: "flex", width: 180 }}>
                <DialogPanel style={{ flex: 1 }}>
                    <DialogPanelList>
                        {shopPages.map((shopPage) => (
                            <DialogPanelListItem
                                key={shopPage.id}
                                active={activeShopPage?.id === shopPage.id}
                                title={shopPage.title}
                                icon={(shopPage.icon)?(<img src={`./assets/shop/icons/${shopPage.icon}`}/>):(undefined)}
                                onClick={() => setActiveShopPage(shopPage)}
                                editable={user?.developer}
                                onEditClick={() => handleEditPage(shopPage)}>
                                {(activeShopPage && (activeShopPage.id === shopPage.id || shopPage.children?.includes(activeShopPage))) && (
                                    <Fragment>
                                        {shopPage.children?.map((shopSubPage) => (
                                            <DialogPanelListItem
                                                key={shopSubPage.id}
                                                subItem={true}
                                                active={activeShopPage?.id === shopSubPage.id}
                                                title={shopSubPage.title}
                                                icon={(shopSubPage.icon)?(<img src={`./assets/shop/icons/${shopSubPage.icon}`}/>):(undefined)}
                                                onClick={() => setActiveShopPage(shopSubPage)}
                                                editable={user?.developer}
                                                onEditClick={() => handleEditPage({ ...shopSubPage, parent: shopPage })}
                                                />
                                        ))}

                                        {(user?.developer) && (
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "flex-end",

                                                padding: 4
                                            }}>
                                                <div className="sprite_add" style={{
                                                    cursor: "pointer"
                                                }} onClick={() => handleCreatePage(shopPage)}/>
                                            </div>
                                        )}
                                    </Fragment>
                                )}
                            </DialogPanelListItem>
                        ))}

                        {(user?.developer) && (
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
                    </DialogPanelList>
                </DialogPanel>
            </div>

            {(activeShopPage) && (<ShopPage page={activeShopPage}/>)}
        </div>
    );
}
