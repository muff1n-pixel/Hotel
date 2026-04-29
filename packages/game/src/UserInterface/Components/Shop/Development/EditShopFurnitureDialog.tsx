import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks2/useDialogs";
import FurnitureImage from "../../Furniture/FurnitureImage";
import { DeleteShopFurnitureData, ShopFurnitureData, ShopPageData, UpdateShopFurnitureData } from "@pixel63/events";
import FurnitureBrowserSelection from "@UserInterface/Components/Browsers/FurnitureBrowserSelection";

export type EditShopFurnitureDialogProps = {
    data: Partial<ShopFurnitureData> & {
        page: ShopPageData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopFurnitureDialog({ hidden, data, onClose }: EditShopFurnitureDialogProps) {
    const dialogs = useDialogs();

    const [furniture, setFurniture] = useState((data.furniture)?([data.furniture]):([]));

    const [credits, setCredits] = useState(data?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.diamonds ?? 0);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateShopFurnitureData, UpdateShopFurnitureData.create({
            id: data?.id,

            pageId: data.page.id,

            furnitureIds: furniture.map((furniture) => furniture.id),

            credits,
            duckets,
            diamonds,
        }));

        dialogs.closeDialog("edit-shop-furniture");
    }, [dialogs, data, furniture, credits, duckets, diamonds]);

    const handleDelete = useCallback(() => {
        if(!confirmDelete) {
            setConfirmDelete(true);

            return;
        }

        webSocketClient.sendProtobuff(DeleteShopFurnitureData, DeleteShopFurnitureData.create({
            id: data.id,
        }));

        dialogs.closeDialog("edit-shop-furniture");
    }, [data, confirmDelete]);

    return (
        <Dialog title={(data?.id)?("Edit shop furniture"):("Create shop furniture")} hidden={hidden} onClose={onClose} width={320} height={580} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: "1 1 0",

                    overflowY: "scroll",

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
                        alignItems: "center",
                        overflowX: "scroll"
                    }}>
                        {furniture?.map((furniture) => (
                            <FurnitureImage key={furniture.id} furnitureData={furniture}/>
                        ))}
                    </div>

                    <FurnitureBrowserSelection allowMultiple={!data.id} furniture={furniture} onChange={setFurniture}/>

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
                        gap: 5
                    }}>
                        {(data.id)?(
                            <DialogButton style={{ flex: 1 }} color="red" onClick={handleDelete}>
                               {(!confirmDelete)?("Delete furniture"):("Confirm deletion")}
                            </DialogButton>
                        ):(
                            <div style={{ flex: 1 }}/>
                        )}

                        <DialogButton style={{ flex: 1 }} onClick={handleUpdate}>
                            {(data?.id)?("Update furniture"):("Create furniture")}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
