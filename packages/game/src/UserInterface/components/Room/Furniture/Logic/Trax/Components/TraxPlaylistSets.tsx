import { FurnitureData } from "@pixel63/events";
import TraxDialogList from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogList";
import TraxDialogSet from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogSet";
import TraxDialogSets from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogSets";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useCallback, useMemo, useState } from "react";

export type TraxPlaylistSetsProps = {
    sets: (FurnitureData | null)[];
    onSetsChange: (sets: (FurnitureData | null)[]) => void;
    onDragSlot: (set: FurnitureData, slot: number) => void;
};

export default function TraxPlaylistSets({ sets, onSetsChange, onDragSlot }: TraxPlaylistSetsProps) {
    const [userSets] = useState<FurnitureData[]>(
        Array(10).fill(null).map((_, index) => FurnitureData.create({ type: `sound_set_${index + 1}`, name: `Sound set ${index + 1}`}))
    );


    const availableSets = useMemo(() => {
        return userSets.filter((set) => !sets.includes(set))
    }, [userSets, sets]);

    const handleAddSet = useCallback((set: FurnitureData) => {
        const index = sets.findIndex((set) => set === null);

        if(index === -1) {
            return;
        }

        const mutatedSets = [...sets];
        mutatedSets[index] = set;
        onSetsChange(mutatedSets);
    }, [sets]);

    const handleEjectSet = useCallback((set: FurnitureData | null) => {
        if(set === null) {
            return;
        }

        const index = sets.indexOf(set);

        if(index === -1) {
            return;
        }

        const mutatedSets = [...sets];
        mutatedSets[index] = null;
        onSetsChange(mutatedSets);
    }, [sets]);

    return (
        <FlexLayout direction="row">
            <TraxDialogList sets={availableSets} onClick={handleAddSet}/>
            
            <TraxDialogSets>
                {sets.map((set, index) => (
                    <TraxDialogSet slot={index} set={set ?? undefined} onDragSlot={(slot) => set && onDragSlot(set, slot)} onEjectClick={() => handleEjectSet(set)}/>
                ))}
            </TraxDialogSets>
        </FlexLayout>
    );
}