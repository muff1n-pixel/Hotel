import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import DialogButton from "../../Dialog/Button/DialogButton";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import Input from "../../Form/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { UpdateShopFurnitureEventData } from "@Shared/Communications/Requests/Shop/Development/UpdateShopFurnitureEventData";
import { useDialogs } from "../../../hooks/useDialogs";
import { ShopPageFurnitureData } from "@Shared/Communications/Responses/Shop/ShopPageFurnitureEventData";
import FurnitureImage from "../../Furniture/FurnitureImage";

export type EditShopFurnitureDialogProps = {
    data: Partial<ShopPageFurnitureData> & {
        page: ShopPageData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopFurnitureDialog({ hidden, data, onClose }: EditShopFurnitureDialogProps) {
    const dialogs = useDialogs();

    const [type, setType] = useState(data?.furniture?.type ?? "");
    const [color, setColor] = useState(data?.furniture?.color ?? 0);

    const [credits, setCredits] = useState(data?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.diamonds ?? 0);

    const handleUpdate = useCallback(() => {
        webSocketClient.send<UpdateShopFurnitureEventData>("UpdateShopFurnitureEvent", {
            id: data?.id ?? null,

            pageId: data.page.id,

            type,
            color,

            credits,
            duckets,
            diamonds,
        });

        dialogs.closeDialog("edit-shop-furniture");
    }, [dialogs, data, type, color, credits, duckets, diamonds]);

    return (
        <Dialog title={(data?.id)?("Edit shop furniture"):("Create shop furniture")} hidden={hidden} onClose={onClose} width={320} height={580} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <p style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center"
                    }}>
                        This furniture {(data?.id)?("is"):("will be")} in the {(data.page.icon) && (<img src={`./assets/shop/icons/${data.page.icon}`}/>)} <b>{data.page.title}</b> page
                    </p>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <FurnitureImage furnitureData={{
                            id: "unknown",
                            category: "unknown",
                            customParams: [],
                            dimensions: {
                                row: 0,
                                column: 0,
                                depth: 0
                            },
                            flags: {
                                giftable: false,
                                inventoryStackable: false,
                                layable: false,
                                recyclable: false,
                                sellable: false,
                                sitable: false,
                                stackable: false,
                                tradable: false,
                                walkable: false,
                            },
                            interactionType: "unknown",
                            name: "unknown",

                            placement: "floor",
                            type,
                            color
                        }}/>
                    </div>

                    <b>Furniture type</b>

                    <Input placeholder="Furniture type" value={type} onChange={setType}/>

                    <b>Furniture color</b>

                    <Input type="number" placeholder="Furniture color" value={color.toString()} onChange={(value) => setColor(parseInt(value))}/>

                    <b>Furniture price</b>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <div style={{
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="sprite_currencies_credits"/>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Input type="number" placeholder="0" value={credits.toString()} onChange={(value) => setCredits(parseInt(value))}/>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <div style={{
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="sprite_currencies_duckets"/>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Input type="number" placeholder="0" value={duckets.toString()} onChange={(value) => setDuckets(parseInt(value))}/>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <div style={{
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="sprite_currencies_diamonds"/>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Input type="number" placeholder="0" value={diamonds.toString()} onChange={(value) => setDiamonds(parseInt(value))}/>
                        </div>
                    </div>

                    <div style={{
                        flex: 1
                    }}>

                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <DialogButton onClick={handleUpdate}>
                            {(data?.id)?("Update page"):("Create page")}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
