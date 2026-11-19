import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks/useDialogs";
import { PetData, ShopPageData, ShopPetData, UpdateShopPetData } from "@pixel63/events";
import PetImage from "../../Pets/PetImage";
import { useTranslation } from "react-i18next";

export type EditShopPetDialogProps = {
    data: Partial<ShopPetData> & {
        page: ShopPageData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopPetDialog({ hidden, data, onClose }: EditShopPetDialogProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");

    const [pet, setPet] = useState(data.pet);

    const [credits, setCredits] = useState(data?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.diamonds ?? 0);

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateShopPetData, UpdateShopPetData.create({
            id: data?.id,

            pageId: data.page.id,

            petId: pet?.id,

            credits,
            duckets,
            diamonds,
        }));

        dialogs.closeDialog("edit-shop-pet");
    }, [dialogs, data, pet, credits, duckets, diamonds]);

    return (
        <Dialog title={(data?.id)?(getTranslation("edit.pet.edit")):(getTranslation("edit.pet.create"))} editMode hidden={hidden} onClose={onClose} width={320} height={580} initialPosition="center">
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
                        {(data?.id)?(getTranslation("edit.pet.location_existing", { page: data.page.title })):(getTranslation("edit.pet.location_new", { page: data.page.title }))}
                    </p>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <PetImage data={pet}/>
                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <b>{getTranslation("edit.pet.pet")}</b>

                        {(pet) && (
                            <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                                dialogs.addUniqueDialog("edit-pet", { ...pet, onClose: () => setPet(pet) });
                            }}>
                                {getTranslation("edit.pet.edit_pet")}
                            </div>
                        )}
                    </div>

                    <Input readonly placeholder={getTranslation("edit.pet.pet_id")} value={pet?.id ?? ""}/>
    
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                            dialogs.addUniqueDialog("pet-browser", {
                                activePet: pet,
                                onSelect: (pet: PetData) => setPet(pet)
                            });
                        }}>
                            {getTranslation("edit.pet.open_browser")}
                        </div>
                    </div>

                    <b>{getTranslation("edit.pet.price")}</b>

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
                            {(data?.id)?(getTranslation("edit.update")):(getTranslation("edit.create"))}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
