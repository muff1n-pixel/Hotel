import { FurnitureData, FurnitureTraxSongData, FurnitureTraxSetData, UserFurnitureData, UserInventorySoundSetsData, GetUserInventorySoundSetsData } from "@pixel63/events";
import TraxDialogList from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogList";
import TraxDialogSet from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogSet";
import TraxDialogSets from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogSets";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { webSocketClient } from "src";

export type TraxPlaylistSetsProps = {
    audioContext: React.RefObject<AudioContext>;

    trax: FurnitureTraxSongData;
    onTraxChange: (trax: FurnitureTraxSongData) => void;
    onDragSlot: (set: FurnitureTraxSetData, slot: number) => void;
};

export default function TraxPlaylistSets({ audioContext, trax, onTraxChange, onDragSlot }: TraxPlaylistSetsProps) {
    const [userSets, setUserSets] = useState<FurnitureData[]>([]);

    const mappedSets = useMemo(() => {
        return Array(4).fill(null).map((_, index) => trax.sets.find((set) => set.index === index));
    }, [trax.sets]);

    const availableSets = useMemo(() => {
        return userSets.filter((set) => !trax.sets.some((traxSet) => traxSet.furniture?.id === set.id))
    }, [userSets, trax.sets]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventorySoundSetsData, {
            async handle(payload: UserInventorySoundSetsData) {
                setUserSets(payload.sets);

                
            },
        });

        webSocketClient.sendProtobuff(GetUserInventorySoundSetsData, GetUserInventorySoundSetsData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(UserInventorySoundSetsData, listener);
        };
    }, []);

    const handleAddSet = useCallback((set: FurnitureData) => {
        let nextIndex = -1;

        for(let index = 0; index < 4; index++) {
            if(trax.sets.some((set) => set.index === index)) {
                continue;
            }

            nextIndex = index;

            break;
        }

        if(nextIndex === -1) {
            return;
        }

        const mutatedTrax = FurnitureTraxSongData.fromJSON(trax);
        mutatedTrax.sets.push(FurnitureTraxSetData.create({
            furniture: set,
            index: nextIndex
        }));
        onTraxChange(mutatedTrax);
    }, [trax]);

    const handleEjectSet = useCallback((set: FurnitureTraxSetData | null) => {
        if(set === null) {
            return;
        }

        const index = trax.sets.findIndex((traxSet) => traxSet.furniture?.id === set.furniture?.id);

        if(index === -1) {
            return;
        }

        const mutatedTrax = FurnitureTraxSongData.fromJSON(trax);
        mutatedTrax.sets.splice(index, 1);
        onTraxChange(mutatedTrax);
    }, [trax]);

    return (
        <FlexLayout direction="row">
            <TraxDialogList sets={availableSets} onClick={handleAddSet}/>
            
            <TraxDialogSets>
                {mappedSets.map((set, index) => (
                    <TraxDialogSet key={set?.furniture?.id} audioContext={audioContext} slot={index} set={set} onDragSlot={(slot) => set && onDragSlot(set, slot)} onEjectClick={() => set && handleEjectSet(set)}/>
                ))}
            </TraxDialogSets>
        </FlexLayout>
    );
}