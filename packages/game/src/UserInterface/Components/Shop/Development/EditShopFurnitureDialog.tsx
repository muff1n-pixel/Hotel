import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks/useDialogs";
import FurnitureImage from "../../Furniture/FurnitureImage";
import { DeleteShopFurnitureData, ShopFurnitureData, ShopPageData, UpdateShopFurnitureData } from "@pixel63/events";
import FurnitureBrowserSelection from "@UserInterface/Components/Browsers/FurnitureBrowserSelection";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import { useTranslation } from "react-i18next";

export type EditShopFurnitureDialogProps = {
    data: Partial<ShopFurnitureData> & {
        page: ShopPageData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopFurnitureDialog({ hidden, data, onClose }: EditShopFurnitureDialogProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");

    const [furniture, setFurniture] = useState((data.furniture)?([data.furniture]):([]));

    const [credits, setCredits] = useState(data?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.diamonds ?? 0);

    const [membership, setMembership] = useState(data?.membership ?? undefined);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateShopFurnitureData, UpdateShopFurnitureData.create({
            id: data?.id,

            pageId: data.page.id,

            furnitureIds: furniture.map((furniture) => furniture.id),

            credits,
            duckets,
            diamonds,

            membership
        }));

        dialogs.closeDialog("edit-shop-furniture");
    }, [dialogs, data, membership, furniture, credits, duckets, diamonds]);

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
        <Dialog title={(data?.id)?(getTranslation("edit.furniture.edit")):(getTranslation("edit.furniture.create"))} editMode hidden={hidden} onClose={onClose} width={320} height={580} initialPosition="center">
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
                        {(data?.id)?(getTranslation("edit.furniture.location_existing", { page: data.page.title })):(getTranslation("edit.furniture.location_new", { page: data.page.title }))}
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

                    <b>{getTranslation("edit.furniture.price")}</b>

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

                    <b>{getTranslation("edit.furniture.membership_required")}</b>

                    <Selection value={membership} onChange={setMembership} items={[
                        {
                            value: undefined,
                            label: getTranslation("edit.none")
                        },
                        {
                            value: "habboclub",
                            label: getTranslation("club.name")
                        },
                        {
                            value: "habbogroup",
                            label: getTranslation("group.name")
                        }
                    ]}/>

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
                               {(!confirmDelete)?(getTranslation("edit.furniture.delete")):(getTranslation("edit.confirm_deletion"))}
                            </DialogButton>
                        ):(
                            <div style={{ flex: 1 }}/>
                        )}

                        <DialogButton style={{ flex: 1 }} onClick={handleUpdate}>
                            {(data?.id)?(getTranslation("edit.update")):(getTranslation("edit.create"))}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
