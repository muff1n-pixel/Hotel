import DialogPanel from "../Dialog/Panels/DialogPanel";
import DialogPanelList from "../Dialog/Panels/DialogPanelList";
import DialogPanelListItem from "../Dialog/Panels/DialogPanelListItem";
import { Fragment, useCallback, useEffect } from "react";
import ShopPage from "./Pages/ShopPage";
import { DialogTabHeaderProps } from "../Dialog/Tabs/DialogTabs";
import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import { useDialogs } from "../../hooks/useDialogs";
import { ShopPageCategory } from "@Shared/Communications/Requests/Shop/GetShopPagesEventData";

export type ShopDialogCategoryProps = {
    editMode?: boolean;
    onHeaderChange: (header: DialogTabHeaderProps) => void;

    shopPages: ShopPageData[];
    activeShopPage?: ShopPageData;
    setActiveShopPage: (page: { id: string; category: ShopPageCategory; }) => void;
}

export default function ShopDialogCategory({ editMode, onHeaderChange, shopPages, activeShopPage, setActiveShopPage }: ShopDialogCategoryProps) {
    const dialogs = useDialogs();

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
        if(!editMode) {
            return;
        }

        dialogs.addUniqueDialog("edit-shop-page", shopPage);
    }, [editMode, dialogs]);

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
            {(activeShopPage?.type !== "features") && (
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
                                    editable={editMode}
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
                                                    editable={editMode}
                                                    onEditClick={() => handleEditPage({ ...shopSubPage, parent: shopPage })}
                                                    />
                                            ))}

                                            {(editMode) && (
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
                        </DialogPanelList>
                    </DialogPanel>
                </div>
            )}

            {(activeShopPage) && (<ShopPage editMode={editMode} page={activeShopPage} setActiveShopPage={setActiveShopPage}/>)}
        </div>
    );
}
