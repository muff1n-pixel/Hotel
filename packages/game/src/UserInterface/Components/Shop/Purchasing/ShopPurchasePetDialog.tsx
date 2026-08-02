import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import { PurchaseShopPetData, ShopPetData, ShopPurchaseData } from "@pixel63/events";
import { useCallback } from "react";
import { clientInstance, webSocketClient } from "@Game/index";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import PetImage from "@UserInterface/Components/Pets/PetImage";
import { useTranslation } from "react-i18next";

export type ShopPurchasePetDialogProps = {
    hidden?: boolean;
    data: {
        activePet: ShopPetData;
        activePetElement: HTMLCanvasElement | null;
        name: string;
    }
    onClose?: () => void;
}

export default function ShopPurchasePetDialog({ data, hidden, onClose }: ShopPurchasePetDialogProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");

    const handlePurchase = useCallback(() => {
        webSocketClient.addProtobuffListener(ShopPurchaseData, {
            async handle(payload: ShopPurchaseData) {
                onClose?.();

                dialogs.setDialogHidden("shop", false);

                if(!payload.success) {
                    return;
                }

                if(data.activePetElement && data.activePet.pet) {
                    for(let index = 0; index < Math.min(payload.quantity, 10); index++) {
                        clientInstance.flyingFurnitureIcons.value!.push({
                            id: Math.random().toString(),
                            pet: data.activePet.pet,
                            position: data.activePetElement.getBoundingClientRect(),
                            targetElementId: "toolbar-inventory"
                        });

                        clientInstance.flyingFurnitureIcons.update();

                        await new Promise((resolve) => setTimeout(resolve, 50));
                    }
                }
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(PurchaseShopPetData, PurchaseShopPetData.create({
            id: data.activePet.id,
            name: data.name
        }));
    }, [data, dialogs, onClose]);

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
                        <PetImage data={data.activePet.pet} style={{
                            maxHeight: "100%",
                            maxWidth: "100%"
                        }}/>
                    </FlexLayout>

                    <FlexLayout direction="column" justify="center">
                        <b>{data.activePet.pet?.name}</b>

                        {(data.activePet.pet?.breed?.name) && (
                            <p>{data.activePet.pet?.breed?.name}</p>
                        )}

                        <FlexLayout direction="row" align="center" gap={0}>
                            <div style={{ color: "#0B0B0B" }}>{getTranslation("price")}:</div>
                            <CurrencyPanel credits={data.activePet.credits} duckets={data.activePet.duckets} diamonds={data.activePet.diamonds}/>
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
