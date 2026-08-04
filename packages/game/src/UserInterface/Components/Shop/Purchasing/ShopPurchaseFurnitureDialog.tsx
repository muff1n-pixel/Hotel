import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { GroupData, PurchaseShopFurnitureData, RoomPositionData, ShopFurnitureData, ShopPurchaseData, UserFurnitureCustomData } from "@pixel63/events";
import { useCallback } from "react";
import { clientInstance, webSocketClient } from "@Game/index";
import { PurchasableItem } from "../Pages/Hooks/usePurchasableItem";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useTranslation } from "react-i18next";
import useShopPurchaseFurniture, { ShopPurchaseFurnitureData } from "./Hooks/useShopPurchaseFurniture";

export type ShopPurchaseFurnitureDialogProps = {
    hidden?: boolean;
    data: ShopPurchaseFurnitureData;
    onClose?: () => void;
}

export default function ShopPurchaseFurnitureDialog({ data, hidden, onClose }: ShopPurchaseFurnitureDialogProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");
    const purchaseFurniture = useShopPurchaseFurniture();

    const handlePurchase = useCallback(() => {
        purchaseFurniture(data).then(() => {
            onClose?.();

            dialogs.setDialogHidden("shop", false);
        });
    }, [data, dialogs, purchaseFurniture, onClose]);

    const handleClose = useCallback(() => {
        onClose?.();

        dialogs.setDialogHidden("shop", false);
    }, [dialogs, onClose]);

    return (
        <Dialog title="Confirm purchase" hidden={hidden} onClose={handleClose} initialPosition="center" width={360} height={235}>
            <DialogContent style={{ flex: 1, gap: 10 }}>
                <FlexLayout flex={1} direction="row" gap={20}>
                    <FlexLayout align="center" justify="center" style={{
                        width: 140,
                        minWidth: 140,
                        height: 140,

                        background: "#F0F0F0",
                        border: "1px solid #5D5D5A",
                        borderRadius: 6,

                        overflow: "hidden",

                        position: "relative"
                    }}>
                        <FurnitureImage furnitureData={data.activeFurniture.furniture} style={{
                            maxHeight: "100%",
                            maxWidth: "100%"
                        }}/>

                        {(data.quantity && data.quantity > 1) && (
                            <div style={{
                                color: "#0B0B0B",

                                position: "absolute",

                                left: 0,
                                bottom: 0,
                                
                                padding: 5
                            }}>
                                {getTranslation("quantity")}: {data.quantity}
                            </div>
                        )}
                    </FlexLayout>

                    <FlexLayout direction="column" justify="center">
                        <b>{data.activeFurniture.furniture?.name}</b>
                        <p>{data.activeFurniture.furniture?.description}</p>

                        <FlexLayout direction="row" align="center" gap={0}>
                            <div style={{ color: "#0B0B0B" }}>{getTranslation("price")}:</div>
                            <CurrencyPanel multiplier={data.quantity} credits={data.activeFurniture.credits} duckets={data.activeFurniture.duckets} diamonds={data.activeFurniture.diamonds}/>
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
