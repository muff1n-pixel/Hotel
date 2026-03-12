import { useCallback, useEffect, useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogContent from "../Dialog/DialogContent";
import DialogTable from "../Dialog/Table/DialogTable";
import { GetPetBrowserData, PetBrowserData, PetData } from "@pixel63/events";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../hooks/useDialogs";
import PetPaletteItem from "./PetPaletteItem";
import DialogButton from "../Dialog/Button/DialogButton";
import { usePermissionAction } from "../../hooks/usePermissionAction";

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

    const [state, setState] = useState(performance.now());

    const [activePet, setActivePet] = useState<PetData | null>(data?.activePet ?? null);

    const [pets, setPets] = useState<PetData[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);

    const handleRefresh = useCallback(() => {
        setState(performance.now());
    }, [page]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(PetBrowserData, {
            async handle(payload: PetBrowserData) {
                setPets(payload.pets);
                setCount(payload.count);
            },
        });

        webSocketClient.sendProtobuff(GetPetBrowserData, GetPetBrowserData.create({
            offset: page * 20
        }));

        return () => {
            webSocketClient.removeProtobuffListener(PetBrowserData, listener);
        };
    }, [ page, state ]);

    return (
        <Dialog title="Pet Browser" hidden={hidden} onClose={onClose} width={680} height={390} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <DialogTable
                        activeId={activePet?.id}
                        columns={["ID", "Type", "Breed", "Palettes"]}
                        flex={[3, 1, 1, 2]}
                        items={pets.map((pet) => {
                            return {
                                id: pet.id,
                                values: [
                                    pet.id,
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
                                    <div className="sprite_room_user_motto_pen" style={{
                                        cursor: "pointer"
                                    }} onClick={() => dialogs.addUniqueDialog("edit-pet", { ...pet, onClose: handleRefresh })}/>
                                ),
                                onClick: () => setActivePet(pet)
                            };
                        })}
                        tools={(hasEditPetsPermissions) && (
                            <div className="sprite_add" style={{
                                cursor: "pointer"
                            }} onClick={() => dialogs.addUniqueDialog("edit-pet", { onClose: handleRefresh })}/>
                        )}/>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",

                        alignItems: "center",

                        fontSize: 12
                    }}>
                        <div>Showing {pets.length} / {count} {(count === 1)?("result"):("results")}</div>

                        <div>Page {page + 1} / {1 + Math.floor(count / 20)}</div>

                        {(data?.onSelect) && (
                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end"
                            }}>
                                <DialogButton disabled={!activePet} onClick={() => {
                                    if(activePet) {
                                        data.onSelect?.(activePet);
                                        onClose?.();
                                    }
                                }}>Select</DialogButton>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
