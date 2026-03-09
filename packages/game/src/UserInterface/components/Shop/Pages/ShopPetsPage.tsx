import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import DialogButton from "../../Dialog/Button/DialogButton";
import { useDialogs } from "../../../hooks/useDialogs";
import { useUser } from "../../../hooks/useUser";
import DialogCurrencyPanel from "../../Dialog/Panels/DialogCurrencyPanel";
import { ShopPetData } from "@pixel63/events";
import useShopPagePets from "./Hooks/useShopPagePets";
import PetImage from "../../Pets/PetImage";

export default function ShopPetsPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const pets = useShopPagePets(page.id);

    const activePetRef = useRef<HTMLCanvasElement>(null);

    const [activePet, setActivePet] = useState<ShopPetData>();

    useEffect(() => {
        if(!page.teaser) {
            setActivePet(pets[0]);
        }
    }, [page, pets]);

    const handlePurchase = useCallback(() => {
        if(!activePet) {
            return;
        }

        /*webSocketClient.sendProtobuff(PurchaseShopBotData, PurchaseShopBotData.create({
            id: activeBot.id
        }));*/
    }, [activePet, activePetRef]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,

                height: 240,
                width: "100%",

                position: "relative"
            }}>
                {(activePet) && (
                    <div style={{
                        flex: 1,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {/*<FigureImage direction={4} figureConfiguration={activePet.figureConfiguration}/>*/}
                        <PetImage data={activePet.pet}/>
                    </div>
                )}

                {(activePet) && (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,

                        justifyContent: "space-between"
                    }}>
                        <div>
                            <b>{activePet.pet?.name}</b>

                            {(activePet.pet?.description) && (
                                <p style={{ fontSize: 12 }}>{activePet.pet.description}</p>
                            )}
                        </div>

                        <div>
                            <DialogCurrencyPanel credits={activePet.credits} duckets={activePet.duckets} diamonds={activePet.diamonds}/>
                        </div>
                    </div>
                )}

                {(!activePet && page.teaser) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img src={`./assets/shop/teasers/${page.teaser}`}/>
                    </div>
                )}
            </div>

            <DialogPanel style={{ flex: "1 1 0", overflow: "hidden" }} contentStyle={{ display: "flex", flex: 1 }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    
                    padding: 4,
                    overflowY: "scroll"
                }}>
                    {pets.map((pet) => (
                        <div key={pet.id} style={{
                            width: 53,
                            height: 62,
                            boxSizing: "border-box",

                            borderRadius: 5,

                            border: (activePet?.id === pet.id)?("2px solid #62C4E8"):("2px solid transparent"),
                            background: (activePet?.id === pet.id)?("#FFFFFF"):(undefined),

                            display: "flex",
                            justifyContent: "center",

                            cursor: "pointer"
                        }} onClick={() => (activePet?.id !== pet.id) && setActivePet(pet)}>
                            <div style={{
                                flex: 1,
                                alignSelf: "center",
                                justifySelf: "center",

                                position: "relative"
                            }}>
                                <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {/*<FigureImage headOnly direction={3} figureConfiguration={pet.figureConfiguration}/>*/}
                                </div>

                                {(editMode) && (
                                    <div style={{
                                        position: "absolute",
                                        top: -10,
                                        right: -6,
                                        cursor: "pointer"
                                    }} onClick={() => dialogs.addUniqueDialog("edit-shop-pet", { ...pet, page: page })}>
                                        <div className="sprite_room_user_motto_pen"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {(editMode) && (
                        <div style={{
                            width: 53,
                            height: 62,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            cursor: "pointer"
                        }} onClick={() => dialogs.addUniqueDialog("edit-shop-pet", { page })}>
                            <div className="sprite_add" style={{
                                marginTop: -8
                            }}/>
                        </div>
                    )}
                </div>
            </DialogPanel>

            <div style={{
                //height: 52,

                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ flex: 1 }}/>
                
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div style={{ flex: 1 }}/>

                    <DialogButton disabled={!activePet || (
                        (activePet.credits ?? 0) > user.credits
                        || (activePet.duckets ?? 0) > user.duckets
                        || (activePet.diamonds ?? 0) > user.diamonds
                    )} style={{ flex: 1 }} onClick={handlePurchase}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
