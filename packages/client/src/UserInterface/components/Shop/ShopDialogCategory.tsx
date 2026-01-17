import DialogPanel from "../Dialog/Panels/DialogPanel";
import DialogPanelList from "../Dialog/Panels/DialogPanelList";
import DialogPanelListItem from "../Dialog/Panels/DialogPanelListItem";
import { useContext, useEffect, useRef, useState } from "react";
import { ShopPageData, ShopPagesResponse } from "@Shared/WebSocket/Events/Shop/ShopPagesResponse";
import { ShopPagesRequest } from "@Shared/WebSocket/Events/Shop/ShopPagesRequest";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import ShopPage from "./Pages/ShopPage";
import { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import { webSocketClient } from "../../..";

export type ShopDialogCategoryProps = {
    category: "frontpage" | "furniture" | "clothing" | "pets";
    onHeaderChange: (header: DialogTabHeaderProps) => void;
}

export default function ShopDialogCategory({ category, onHeaderChange }: ShopDialogCategoryProps) {
    const [activeShopPage, setActiveShopPage] = useState<ShopPageData>();

    const [shopPages, setShopPages] = useState<ShopPageData[]>([]);

    useEffect(() => {
        const listener = (event: WebSocketEvent<ShopPagesResponse>) => {
            if(event.data.category === category) {
                setShopPages(event.data.pages);
                setActiveShopPage(event.data.pages[0]);
            }
        }

        webSocketClient.addEventListener<WebSocketEvent<ShopPagesResponse>>("ShopPagesResponse", listener);

        webSocketClient.send<ShopPagesRequest>("ShopPagesRequest", {
            category
        });

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<ShopPagesResponse>>("ShopPagesResponse", listener);
        };
    }, []);

    useEffect(() => {
        onHeaderChange({
            title: activeShopPage?.title,
            description: activeShopPage?.description,

            iconImage: (activeShopPage?.icon)?(`./assets/shop/icons/${activeShopPage.icon}`):(undefined),
            backgroundImage: (activeShopPage?.header)?(`./assets/shop/headers/${activeShopPage.header}`):(undefined)
        });
    }, [ activeShopPage ]);

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
                                onClick={() => setActiveShopPage(shopPage)}>
                                {(activeShopPage && (activeShopPage.id === shopPage.id || shopPage.children?.includes(activeShopPage))) && shopPage.children?.map((shopSubPage) => (
                                    <DialogPanelListItem
                                        key={shopSubPage.id}
                                        subItem={true}
                                        active={activeShopPage?.id === shopSubPage.id}
                                        title={shopSubPage.title}
                                        icon={(shopSubPage.icon)?(<img src={`./assets/shop/icons/${shopSubPage.icon}`}/>):(undefined)}
                                        onClick={() => setActiveShopPage(shopSubPage)}/>
                                ))}
                            </DialogPanelListItem>
                        ))}
                    </DialogPanelList>
                </DialogPanel>
            </div>

            {(activeShopPage) && (<ShopPage page={activeShopPage}/>)}
        </div>
    );
}
