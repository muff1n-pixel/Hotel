import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import DialogPanelListItem from "../Dialog/Panels/DialogPanelListItem";
import { Fragment } from "react/jsx-runtime";

export type ShopPagesListProps = {
    editMode?: boolean;
    handleEditPage: (shopPage: ShopPageData) => void;
    handleCreatePage: (shopPage?: ShopPageData) => void;

    activeShopPage?: ShopPageData;
    shopPages: ShopPageData[];
    parentId: string | null;
    onPageChange: (shopPage: ShopPageData) => void;

    tabs: number;
};

export default function ShopPagesList({ parentId, editMode, tabs, handleEditPage, handleCreatePage, activeShopPage, onPageChange, shopPages }: ShopPagesListProps) {
    return (
        <Fragment>
            {shopPages.filter((shopPage) => shopPage.parentId === parentId).map((shopPage) => (
                <DialogPanelListItem
                    key={shopPage.id}
                    active={activeShopPage?.id === shopPage.id}
                    title={shopPage.title}
                    icon={(shopPage.icon)?(<img src={`./assets/shop/icons/${shopPage.icon}`}/>):(undefined)}
                    onClick={() => onPageChange(shopPage)}
                    editable={editMode}
                    onEditClick={() => handleEditPage(shopPage)}
                    subItem={tabs}
                    >
                    {(activeShopPage && (activeShopPage.id === shopPage.id || activeShopPage.parentId === shopPage.id || shopPages.some((_shopPage) => _shopPage.id === activeShopPage.parentId && _shopPage.parentId === shopPage.id)) && (
                        <Fragment>
                            <ShopPagesList tabs={tabs + 1} editMode={editMode} handleCreatePage={handleCreatePage} handleEditPage={handleEditPage} parentId={shopPage.id} shopPages={shopPages} activeShopPage={activeShopPage} onPageChange={onPageChange}/>

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
                    ))}
                </DialogPanelListItem>
            ))}
        </Fragment>
    );
}