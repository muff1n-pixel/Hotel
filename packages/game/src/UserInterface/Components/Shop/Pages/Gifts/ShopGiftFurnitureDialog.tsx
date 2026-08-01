import Dialog from "../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../Common/Dialog/Components/DialogContent";
import { GroupData, PurchaseShopFurnitureData, RoomPositionData, ShopFurnitureData, ShopPurchaseData, UserFurnitureCustomData } from "@pixel63/events";
import { useCallback, useState } from "react";
import { clientInstance, webSocketClient } from "@Game/index";
import { PurchasableItem } from "../../Pages/Hooks/usePurchasableItem";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import Input from "@UserInterface/Common/Form/Components/Input";
import FurnitureGift from "@UserInterface/Components/Furniture/FurnitureGift";
import { useUser } from "@UserInterface/Hooks/useUser";
import useShopGiftFurniture from "../Hooks/useShopGiftFurniture";
import Selection from "@UserInterface/Common/Form/Components/Selection";

export type ShopGiftFurnitureDialogProps = {
    hidden?: boolean;
    data: {
        activeFurniture: ShopFurnitureData;
        data?: UserFurnitureCustomData;
        group?: GroupData;
    }
    onClose?: () => void;
}

export default function ShopGiftFurnitureDialog({ data, hidden, onClose }: ShopGiftFurnitureDialogProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const giftFurniture = useShopGiftFurniture();

    const [giftFurnitureIndex, setGiftFurnitureIndex] = useState(0);

    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handlePurchase = useCallback(() => {
        webSocketClient.addProtobuffListener(ShopPurchaseData, {
            async handle(payload: ShopPurchaseData) {
                if(payload.success) {
                    onClose?.();

                    dialogs.setDialogHidden("shop", false);
                }
            },
        }, {
            once: true
        });

        webSocketClient.sendProtobuff(PurchaseShopFurnitureData, PurchaseShopFurnitureData.create({
            id: data.activeFurniture.id,
            groupId: data.group?.id,
            quantity: 1,
            data: data.data,

            gift: {
                name,
                message,
                furnitureId: giftFurniture[giftFurnitureIndex].id
            }
        }));
    }, [data, dialogs, onClose, name, message, giftFurniture, giftFurnitureIndex]);

    const handleClose = useCallback(() => {
        onClose?.();

        dialogs.setDialogHidden("shop", false);
    }, [dialogs, onClose]);

    return (
        <Dialog title="Customize your gift" hidden={hidden} onClose={handleClose} initialPosition="center" width={360} height={"auto"} assumedHeight={235} style={{
            overflow: "visible"
        }}>
            {/*<DialogContent style={{ flex: 1, gap: 10, background: "#FFFFFF" }}>
                <FlexLayout direction="row" gap={20} align="center">
                    <FlexLayout align="center" justify="center" style={{
                        width: 100,
                        minWidth: 100,
                        height: 100,

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
                    </FlexLayout>

                    <FlexLayout direction="column" justify="center">
                        <b>{data.activeFurniture.furniture?.name}</b>
                        <p>{data.activeFurniture.furniture?.description}</p>

                        <FlexLayout direction="row" align="center" gap={0}>
                            <div style={{ color: "#0B0B0B" }}>Price:</div>
                            <CurrencyPanel credits={data.activeFurniture.credits} duckets={data.activeFurniture.duckets} diamonds={data.activeFurniture.diamonds}/>
                        </FlexLayout>
                    </FlexLayout>
                </FlexLayout>
            </DialogContent>*/}

            <DialogContent style={{ flex: 1, gap: 10 }}>
                <Input placeholder="Enter recipient's name" value={name} onChange={setName}/>

                <FlexLayout justify="center" align="center">
                    <FurnitureGift name={user.name} figureConfiguration={user.figureConfiguration} message={message} onChange={setMessage}/>
                </FlexLayout>

                <FlexLayout direction="row" gap={10} align="center">
                    <FlexLayout align="center" justify="center" style={{
                        width: 100,
                        minWidth: 100,
                        height: 100,

                        background: "#F0F0F0",
                        border: "1px solid #5D5D5A",
                        borderRadius: 6,

                        overflow: "hidden",

                        position: "relative"
                    }}>
                        <FurnitureImage furnitureData={giftFurniture[giftFurnitureIndex]} style={{
                            maxHeight: "100%",
                            maxWidth: "100%"
                        }}/>
                    </FlexLayout>

                    <FlexLayout flex={1} direction="column" >
                        <b>{giftFurniture[giftFurnitureIndex]?.name}</b>
                        <p>{giftFurniture[giftFurnitureIndex]?.description}</p>

                        <Selection value={giftFurnitureIndex} items={giftFurniture.map((furniture, index) => {
                            return {
                                value: index,
                                label: furniture.name
                            }
                        })} onChange={setGiftFurnitureIndex} style={{ flex: 1 }}/>
                    </FlexLayout>
                </FlexLayout>

                <div style={{ flex: 1 }}/>

                <FlexLayout direction="row" justify="space-between">
                    <div>
                        <DialogButton onClick={handleClose}>Cancel</DialogButton>
                    </div>
                    
                    <div>
                        <DialogButton color="green" onClick={handlePurchase}>Purchase gift</DialogButton>
                    </div>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
