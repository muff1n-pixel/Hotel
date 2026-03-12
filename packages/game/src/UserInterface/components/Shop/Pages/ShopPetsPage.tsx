import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import DialogButton from "../../Dialog/Button/DialogButton";
import { useDialogs } from "../../../hooks/useDialogs";
import { useUser } from "../../../hooks/useUser";
import DialogCurrencyPanel from "../../Dialog/Panels/DialogCurrencyPanel";
import { PurchaseShopPetData, ShopPetData } from "@pixel63/events";
import useShopPagePets from "./Hooks/useShopPagePets";
import PetImage from "../../Pets/PetImage";
import Pet from "@Client/Pets/Pet";
import Input from "../../Form/Input";
import { webSocketClient } from "../../../..";

type FilteredShopPet = {
    pet: ShopPetData;
    colors: string[];
};

export default function ShopPetsPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const pets = useShopPagePets(page.id);

    const activePetRef = useRef<HTMLCanvasElement>(null);

    const [activePet, setActivePet] = useState<ShopPetData>();
    const [activeFilteredPets, setActiveFilteredPets] = useState<FilteredShopPet[]>([]);

    const [filteredPets, setFilteredPets] = useState<ShopPetData[]>([]);

    const [name, setName] = useState("");

    useEffect(() => {
        if(!page.teaser) {
            setActivePet(pets[0]);
        }
    }, [page, pets]);
    
    useEffect(() => {
        const filteredPets: ShopPetData[] = [];

        for(const pet of pets.toSorted((petA, petB) => (petB.pet?.breed?.index ?? 0) - (petA.pet?.breed?.index ?? 0))) {
            if(pet.pet?.breed && filteredPets.some((filteredPet) => filteredPet.pet?.breed?.id === pet.pet?.breed?.id)) {
                continue;
            }

            filteredPets.push(pet);
        }

        setFilteredPets(filteredPets);
    }, [pets]);

    useEffect(() => {
        if(!activePet) {
            return;
        }
            
        Promise.all(pets
            .filter((shopPet) => ((activePet.pet?.breed)?(shopPet.pet?.breed?.id === activePet.pet?.breed?.id):(activePet.id === shopPet.id)))
            .map(async (shopPet) => {
                if(!shopPet.pet) {
                    return null;
                }

                const pet = new Pet(shopPet.pet.type, shopPet.pet?.palettes);

                await pet.getData();

                const colors = pet.getPaletteColors("body");

                if(!colors) {
                    return null;
                }

                return {
                    pet: shopPet,
                    colors
                };
            }))
            .then((values) => setActiveFilteredPets(values.filter<FilteredShopPet>((pet) => pet !== null)));
    }, [activePet]);

    const handlePurchase = useCallback(() => {
        if(!activePet) {
            return;
        }

        webSocketClient.sendProtobuff(PurchaseShopPetData, PurchaseShopPetData.create({
            id: activePet.id,
            name
        }));

        dialogs.closeDialog("edit-pet");
    }, [activePet, activePetRef, name]);

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
                        <PetImage key={activePet.id} data={activePet.pet}/>
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

                            {(activePet.pet?.breed) && (
                                <div>{activePet.pet.breed.name}</div>
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
            
            <DialogPanel>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    padding: 2
                }}>
                    {activeFilteredPets.map((filteredPet) => (
                        <div key={filteredPet?.pet.id} style={{
                            border: "1px solid black",
                            borderRadius: 3,
                            cursor: "pointer",

                            position: "relative"
                        }} onClick={() => setActivePet(filteredPet.pet)}>
                            <div style={{
                                width: 38,
                                height: 30,

                                border: "2px solid white",
                                borderWidth: (activePet?.id === filteredPet.pet?.id)?(4):(2),
                                borderRadius: 3,
                                boxSizing: "border-box",

                                boxShadow: (activePet?.id === filteredPet.pet?.id)?("inset 0 0 0 1px rgba(0, 0, 0, .4)"):("none"),

                                display: "flex",
                                flexDirection: "row"
                            }}>
                                {filteredPet.colors.map((color) => (
                                    <div key={color} style={{
                                        flex: 1,

                                        background: color
                                    }}/>
                                ))}
                            </div>

                            {(editMode) && (
                                <div style={{
                                    position: "absolute",
                                    top: -10,
                                    right: -10,
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-shop-pet", { ...filteredPet.pet, page: page })}>
                                    <div className="sprite_room_user_motto_pen"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </DialogPanel>

            <DialogPanel style={{ flex: "1 1 0", overflow: "hidden" }} contentStyle={{ display: "flex", flex: 1 }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    
                    padding: 4,
                    overflowY: "scroll"
                }}>
                    {(filteredPets).map((pet) => {
                        const active = pet.pet?.breed?.id === activePet?.pet?.breed?.id;
                        
                        return (
                            <div key={pet.id} style={{
                                width: 60,
                                height: 60,
                                boxSizing: "border-box",

                                borderRadius: 5,

                                border: (active)?("2px solid #62C4E8"):("2px solid transparent"),
                                background: (active)?("#FFFFFF"):(undefined),

                                display: "flex",
                                justifyContent: "center",

                                cursor: "pointer"
                            }} onClick={() => (!active) && setActivePet(pet)}>
                                <div style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    justifySelf: "center",

                                    position: "relative"
                                }}>
                                    <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <PetImage data={pet.pet} headOnly/>
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
                        );
                    })}

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
                display: "flex",
                flexDirection: "column",
                gap: 5
            }}>
                <div style={{ fontSize: 12 }}>Name your pet:</div>

                <Input value={name} onChange={setName} maxLength={24}/>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ flex: 1 }}/>
                
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div style={{ flex: 1 }}/>

                    <DialogButton disabled={!name.length || !activePet || (
                        (activePet.credits ?? 0) > user.credits
                        || (activePet.duckets ?? 0) > user.duckets
                        || (activePet.diamonds ?? 0) > user.diamonds
                    )} style={{ flex: 1 }} onClick={handlePurchase}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
