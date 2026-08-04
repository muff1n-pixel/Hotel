import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { EnterRoomData, PurchaseShopBundleData, ShopBundlePurchaseData, ShopFurnitureData, ShopPageData } from "@pixel63/events";
import { useCallback } from "react";
import { webSocketClient } from "@Game/index";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useTranslation } from "react-i18next";
import useShopPurchaseBundle from "./Hooks/useShopPurchaseBundle";

export type ShopPurchaseBundleDialogProps = {
    hidden?: boolean;
    data: {
        page: ShopPageData;
        shopFurniture: ShopFurnitureData[];
    }
    onClose?: () => void;
}

export default function ShopPurchaseBundleDialog({ data, hidden, onClose }: ShopPurchaseBundleDialogProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");
    const purchaseBundle = useShopPurchaseBundle();

    const handlePurchase = useCallback(() => {
        purchaseBundle(data).then(() => {
            onClose?.();

            dialogs.setDialogHidden("shop", false);
        });
    }, [data, dialogs, onClose, purchaseBundle]);

    const handleClose = useCallback(() => {
        onClose?.();

        dialogs.setDialogHidden("shop", false);
    }, [dialogs, onClose]);

    return (
        <Dialog title="Confirm purchase" hidden={hidden} onClose={handleClose} initialPosition="center" width={360} height={235}>
            <DialogContent style={{ flex: 1, gap: 10 }}>
                <FlexLayout flex={1} direction="row" gap={20}>
                    <FlexLayout align="center" justify="center">
                        {(data.page.teaser) && (
                            <img src={`./assets/shop/teasers/${data.page.teaser}`}/>
                        )}
                    </FlexLayout>

                    <FlexLayout direction="column" justify="center">
                        <b>{data.page.title}</b>

                        {(data.page.description) && (
                            <p>{data.page.description}</p>
                        )}

                        <FlexLayout direction="row" align="center" gap={0}>
                            <div style={{ color: "#0B0B0B" }}>{getTranslation("price")}:</div>
                            <CurrencyPanel credits={data.page.bundle?.credits} duckets={data.page.bundle?.duckets} diamonds={data.page.bundle?.diamonds}/>
                        </FlexLayout>
                    </FlexLayout>
                </FlexLayout>

                <FlexLayout direction="row" justify="space-between">
                    <div>
                        <DialogButton onClick={handleClose}>{getTranslation("cancel")}</DialogButton>
                    </div>
                    
                    <div>
                        <DialogButton color="green" onClick={handlePurchase}>{getTranslation("purchase")}</DialogButton>
                    </div>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
