import DialogButton from "../../Dialog/Button/DialogButton";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import Input from "../../Form/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../hooks/useDialogs";
import { PetData, ShopPageData, ShopPetData, UpdateShopPetData } from "@pixel63/events";
import PetImage from "../../Pets/PetImage";

export type EditShopPetDialogProps = {
    data: Partial<ShopPetData> & {
        page: ShopPageData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopPetDialog({ hidden, data, onClose }: EditShopPetDialogProps) {
    const dialogs = useDialogs();

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

    console.log({ pet} );

    return (
        <Dialog title={(data?.id)?("Edit shop pet"):("Create shop pet")} hidden={hidden} onClose={onClose} width={320} height={580} initialPosition="center">
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
                        This pet {(data?.id)?("is"):("will be")} in the {(data.page.icon) && (<img src={`./assets/shop/icons/${data.page.icon}`}/>)} <b>{data.page.title}</b> page
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
                        <b>Pet</b>

                        {(pet) && (
                            <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                                dialogs.addUniqueDialog("edit-pet", { ...pet, onClose: () => setPet(pet) });
                            }}>
                                Edit pet
                            </div>
                        )}
                    </div>

                    <Input readonly placeholder="Pet ID" value={pet?.id ?? ""}/>
    
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
                            Open pet browser
                        </div>
                    </div>

                    <b>Pet price</b>

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
                            {(data?.id)?("Update pet"):("Create pet")}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
