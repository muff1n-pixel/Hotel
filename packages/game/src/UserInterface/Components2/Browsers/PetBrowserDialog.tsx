import { Fragment, useEffect, useState } from "react";
import { GetPetBrowserData, PetBrowserData, PetData } from "@pixel63/events";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks/useDialogs";
import PetPaletteItem from "../Pets/PetPaletteItem";
import { usePermissionAction } from "../../Hooks/usePermissionAction";
import Input from "@UserInterface/Common/Form/Components/Input";
import PetImage from "@UserInterface/Components2/Pets/PetImage";
import BrowserDialog from "@UserInterface/Common/Browser/BrowserDialog";

export type PetBrowserDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
    data?: {
        activePet?: PetData;
        onSelect?: (pet: PetData) => void;
    }
}

export default function PetBrowserDialog({ data, hidden, onClose }: PetBrowserDialogProps) {
    const dialogs = useDialogs();
    const hasEditPetsPermissions = usePermissionAction("pets:edit");
    
    const [pets, setPets] = useState<PetData[]>([]);
    const [activePet, setActivePet] = useState<PetData | null>(data?.activePet ?? null);
    
    const [state, setState] = useState(performance.now());
    
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    
    const [searchId, setSearchId] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchBreed, setSearchBreed] = useState("");

    useEffect(() => {
        setPage(0);
    }, [searchId, searchType, searchBreed]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(PetBrowserData, {
            async handle(payload: PetBrowserData) {
                setPets(payload.pets);
                setCount(payload.count);
            },
        });

        webSocketClient.sendProtobuff(GetPetBrowserData, GetPetBrowserData.create({
            offset: page * 20,

            searchId,
            searchType,
            searchBreed
        }));

        return () => {
            webSocketClient.removeProtobuffListener(PetBrowserData, listener);
        };
    }, [ page, state, searchId, searchType, searchBreed ]);

    return (
        <BrowserDialog
            activeId={activePet?.id ?? null}

            count={count}
            page={page}

            table={{
                flex: [1, 1, 1, 2],
                columns: ["Image", "Type", "Breed", "Palettes"],
                items: pets.map((pet) => {
                    return {
                        id: pet.id,
                        values: [
                            (
                                <div style={{ width: 100, maxHeight: 100 }}>
                                    <PetImage data={pet}/>
                                </div>
                            ),
                            pet.type,
                            pet.breed?.name ?? null,
                            (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 5
                                }}>
                                    {pet.palettes.map((palette, index) => {
                                        return (
                                            <div key={index} style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 5
                                            }}>
                                                <PetPaletteItem type={pet.type} palette={palette}/> {palette.tags.join(', ')}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ],
                        tools: (hasEditPetsPermissions) && (
                            <Fragment>
                                <div className="sprite_room_user_motto_pen" style={{
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-pet", { ...pet, onClose: setState(performance.now()) })}/>
                                
                                <div className="sprite_add" style={{
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-pet", { ...pet, id: undefined, onClose: setState(performance.now()) })}/>
                            </Fragment>
                        ),
                        onClick: () => setActivePet(pet)
                    };
                }),
                tools: (hasEditPetsPermissions) && (
                    <div className="sprite_add" style={{
                        cursor: "pointer"
                    }} onClick={() => dialogs.addUniqueDialog("edit-pet", { onClose: setState(performance.now()) })}/>
                )
            }}

            onSelect={(data?.onSelect) && ((id) => data?.onSelect?.(pets.find((pet) => pet.id === id)!))}
            onPageChange={setPage}

            hidden={hidden}
            onClose={onClose}>
            <Input style={{ width: "100%" }} placeholder="ID" value={searchId} onChange={setSearchId}/>
            <Input style={{ width: "100%" }} placeholder="Type" value={searchType} onChange={setSearchType}/>
            <Input style={{ width: "100%" }} placeholder="Breed" value={searchBreed} onChange={setSearchBreed}/>
        </BrowserDialog>
    );
}
