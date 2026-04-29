import { GetPetBreedsData, PetBreedData, PetBreedsData, PetData, PetPaletteData, UpdatePetData } from "@pixel63/events";
import { Fragment, useCallback, useEffect, useState } from "react";
import Dialog from "../../Common/Dialog/Dialog";
import DialogContent from "../../Common/Dialog/Components/DialogContent";
import PetImage from "./PetImage";
import Input from "../../Common/Form/Components/Input";
import Selection from "../../Common/Form/Components/Selection";
import DialogButton from "../../Common/Dialog/Components/Button/DialogButton";
import { webSocketClient } from "../../..";
import DialogTable from "../../Common/Dialog/Components/Table/DialogTable";
import PetPaletteSelection from "./PetPaletteSelection";
import { useDialogs } from "../../Hooks2/useDialogs";

export type EditPetDialogProps = {
    hidden?: boolean;
    data?: PetData & {
        onClose?: (pet?: PetData) => void;
    };
    onClose?: () => void;
}

export default function EditPetDialog({ hidden, data, onClose }: EditPetDialogProps) {
    const dialogs = useDialogs();

    const [type, setType] = useState<string>(data?.type ?? "");

    const [name, setName] = useState<string>(data?.name ?? "");

    const [breed, setBreed] = useState<string>(data?.breed?.name ?? "");
    const [breedIndex, setBreedIndex] = useState<number | null>(data?.breed?.index ?? null);

    const [palettes, setPalettes] = useState<PetPaletteData[]>(data?.palettes ?? []);
    const [paletteIndex, setPaletteIndex] = useState<number | null>(null);
    const [paletteTags, setPaletteTags] = useState<string>("");

    const [breeds, setBreeds] = useState<PetBreedData[]>([]);
    const [newBreed, setNewBreed] = useState(false);

    useEffect(() => {
        if(!type) {
            return;
        }

        const listener = webSocketClient.addProtobuffListener(PetBreedsData, {
            async handle(payload: PetBreedsData) {
                if(payload.type === type) {
                    setBreeds(payload.breeds);
                }
            },
        });

        webSocketClient.sendProtobuff(GetPetBreedsData, GetPetBreedsData.create({
            type: type
        }));

        return () => {
            webSocketClient.removeProtobuffListener(PetBreedsData, listener);
        };
    }, [type]);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdatePetData, UpdatePetData.create({
            id: data?.id,

            type,

            name,

            breedName: breed,
            breedIndex: breedIndex ?? undefined,

            palettes
        }));

        data?.onClose?.(PetData.create({
            id: data?.id,

            type,

            name,

            breed: PetBreedData.create({
                id: data?.breed?.id,
                name: breed,
                index: breedIndex ?? undefined
            }),

            palettes
        }));

        onClose?.();
    }, [ data, onClose, type, name, breed, breedIndex, palettes ]);

    return (
        <Dialog title="Pet Editor" hidden={hidden} onClose={onClose} initialPosition="center" width={820} height={340} style={{
            overflow: "visible"
        }}>
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "row",
                    gap: 20
                }}>
                    <div style={{
                        flex: 2,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        overflow: "hidden"
                    }}>
                        <div>
                            <PetImage data={PetData.create({
                                type,
                                palettes
                            })}/>
                        </div>
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>Pet type</b>

                        <Input value={type} onChange={setType}/>

                        <b>Pet name</b>

                        <Input value={name} onChange={setName}/>
                        
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <b>Pet breed name</b>

                            {(breeds.length > 0) && (
                                <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => setNewBreed(!newBreed)}>{(newBreed)?("Show list"):("New breed")}</div>
                            )}
                        </div>

                        {(!breeds.length || newBreed)?(
                            <Input value={breed} onChange={setBreed}/>
                        ):(
                            <Selection value={breed} items={breeds.map((breed) => {
                                return {
                                    value: breed.name,
                                    label: breed.name
                                };
                            })} onChange={(value) => {
                                setBreed(value);
                                setBreedIndex(breeds.find((breed) => breed.name === value)?.index || 0);
                            }}/>
                        )}

                        {(!breeds.length || newBreed) && (
                            <Fragment>
                                <b>Pet breed index</b>

                                <Input type="number" value={breedIndex?.toString()} onChange={(value) => setBreedIndex(parseInt(value))}/>
                            </Fragment>
                        )}
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>Pet palette</b>

                        <DialogTable
                            activeId={paletteIndex}
                            columns={["Tags", "Palette ID"]}
                            flex={[3, 2]}
                            items={palettes.map((palette, index) => {
                                return {
                                    id: index,
                                    values: [palette.tags.join(', '), palette.paletteId],
                                    onClick: () => {
                                        setPaletteIndex(index);
                                        setPaletteTags(palette.tags.join(', '));
                                    }
                                };
                            })}
                            tools={(
                                <div className="sprite_add" style={{
                                    cursor: "pointer"
                                }} onClick={() => {
                                    setPalettes(palettes.concat([
                                        PetPaletteData.create({
                                            tags: [],
                                            paletteId: 0
                                        })
                                    ]));
                                    setPaletteIndex(palettes.length);
                                    setPaletteTags("");
                                }}/>
                            )}/>

                        {(paletteIndex !== null) && (
                            <Fragment>
                                <div style={{
                                    fontSize: 12,
                                    lineHeight: 1.5,

                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 5
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <i>Tags</i>

                                        <Input value={paletteTags} onChange={(tags) => {
                                            const mutatedPalettes = [...palettes];

                                            mutatedPalettes[paletteIndex].tags = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
                                            
                                            setPalettes(mutatedPalettes);
                                            setPaletteTags(tags);
                                        }}/>
                                    </div>

                                    <div style={{ flex: 1}}>
                                        <i>Palette</i>

                                        <PetPaletteSelection type={type} breed={breedIndex} tags={palettes[paletteIndex].tags} value={palettes[paletteIndex].paletteId} onChange={(paletteId) => {
                                            const mutatedPalettes = [...palettes];

                                            mutatedPalettes[paletteIndex].paletteId = paletteId;
                                            
                                            setPalettes(mutatedPalettes);
                                        }}/>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: 12,
                                    lineHeight: 1.5
                                }}>
                                    <i>Palette color</i>
                                    
                                    <Input value={palettes[paletteIndex].color} onChange={(value) => {
                                        const mutatedPalettes = [...palettes];

                                        mutatedPalettes[paletteIndex].color = value;
                                        
                                        setPalettes(mutatedPalettes);
                                    }}/>
                                </div>
                            </Fragment>
                        )}

                        <div>
                            <DialogButton onClick={handleApply}>{(data?.id)?("Update"):("Create")}</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
