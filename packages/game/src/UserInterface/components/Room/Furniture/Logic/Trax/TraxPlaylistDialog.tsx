import { FurnitureData } from "@pixel63/events";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import FurnitureIcon from "@UserInterface/Components/Furniture/FurnitureIcon";
import TraxPlaylistSets from "@UserInterface/Components/Room/Furniture/Logic/Trax/Components/TraxPlaylistSets";
import useTraxSlider from "@UserInterface/Components/Room/Furniture/Logic/Trax/Hooks/useTraxSlider";
import useTraxSlot from "@UserInterface/Components/Room/Furniture/Logic/Trax/Hooks/useTraxSlot";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

type TraxSlot = {
    row: number;
    column: number;

    length: number;

    set: number;
    slot: number;
};

export type TraxPlaylistDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function TraxPlaylistDialog({ hidden, onClose }: TraxPlaylistDialogProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const slotRef = useRef<HTMLDivElement>(null);

    const [slots, setSlots] = useState<TraxSlot[]>([]);
    const [sets, setSets] = useState<(FurnitureData | null)[]>(Array(4).fill(null));

    useEffect(() => {
        setSlots(slots.filter((slot) => sets[slot.set]));
    }, [sets]);

    const mappedSlots = useMemo(() => {
        console.log({ slots });
        return Array(4).fill(null).map((_, row) => {
            const rowSlots = slots.filter((slot) => slot.row === row);

            return Array(24).fill(null).map((_, column) => {
                return rowSlots.find((slot) => column >= slot.column && column < slot.column + slot.length);
            });
        });
    }, [slots]);

    const handleSetSlot = useCallback((set: FurnitureData, slot: number, length: number, row: number, column: number) => {
        const mutatedSlot = slots.filter((slot) => {
            if(slot.row !== row) {
                return true;
            }

            if(slot.column + slot.length - 1 < column) {
                return true;
            }

            if(slot.column > column + length - 1) {
                return true;
            }

            return false;
        });

        mutatedSlot.push({
            row,
            column,
            length,
            
            set: sets.indexOf(set),
            slot
        });

        setSlots(mutatedSlot);
    }, [slots, sets]);

    const handleRemoveSlot = useCallback((length: number, row: number, column: number) => {
        const mutatedSlot = slots.filter((slot) => {
            if(slot.row !== row) {
                return true;
            }

            if(slot.column + slot.length - 1 < column) {
                return true;
            }

            if(slot.column > column + length - 1) {
                return true;
            }

            return false;
        });

        setSlots(mutatedSlot);
    }, [slots, sets]);

    const slider = useTraxSlider();
    const slot = useTraxSlot(containerRef, slotRef, handleSetSlot);

    return (
        <Fragment>
            <TraxDialog title="Trax Editor" hidden={hidden} onClose={onClose} width={590} height={350} initialPosition="center" style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <TraxPlaylistSets sets={sets} onSetsChange={setSets} onDragSlot={slot.handleDragging}/>

                <TraxDialogPanel style={{
                    padding: "8px 8px 8px 4px"
                }}>
                    <FlexLayout gap={2} direction="row">
                        <FlexLayout direction="column" gap={2}>
                            {(Array(4).fill(null).map((_, row) => (
                                <FlexLayout key={row} justify="center" align="center" style={{
                                    width: 16,
                                    height: 25,

                                    textAlign: "center",

                                    fontSize: 11,
                                    fontFamily: "Ubuntu Bold",
                                    textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000"
                                }}>
                                    {row + 1}
                                </FlexLayout>
                            )))}

                            <div style={{ height: 15 }}/>
                        </FlexLayout>

                        <FlexLayout ref={containerRef} direction="column" gap={2}>
                            {(Array(4).fill(null).map((_, row) => (
                                <FlexLayout key={row} direction="row" gap={1} style={{
                                    height: 25,

                                    border: "1px solid #000000",
                                    background: "#83A2B0",
                                    borderRadius: 6,
                                    padding: 1,

                                    boxSizing: "border-box"
                                }}>
                                    {Array(24).fill(null).map((_, column) => (
                                        <div key={column} className="sprite_dialog_trax_slot" data-trax-row={row} data-trax-slot={column}>
                                            {(mappedSlots[row][column]) && (
                                                <div className={`sprite_dialog_trax_samples_set_${mappedSlots[row][column].set + 1}_sample_${mappedSlots[row][column].slot + 1}`} style={{
                                                    position: "relative",
                                                    cursor: "pointer"
                                                }} onClick={() => mappedSlots[row][column] && handleRemoveSlot(mappedSlots[row][column].length, mappedSlots[row][column].row, mappedSlots[row][column].column)}>
                                                    {(mappedSlots[row][column].slot === mappedSlots[row][column + 1]?.slot) && (
                                                        <div className={`sprite_dialog_trax_samples_set_${mappedSlots[row][column].set + 1}_connector`} style={{
                                                            position: "absolute",

                                                            right: -3,
                                                            top: 0,

                                                            zIndex: 1
                                                        }}/>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </FlexLayout>
                            )))}

                            <div ref={slider.sliderContainerRef} style={{
                                height: 15,

                                position: "relative"
                            }}>
                                <div style={{
                                    width: 25,
                                    position: "absolute",

                                    display: "flex",

                                    top: -5,
                                    left: slider.sliderIndex * 22,

                                    zIndex: 1
                                }}>
                                    <div className="sprite_dialog_trax_slider" style={{
                                        position: "absolute",

                                        bottom: 0
                                    }}/>

                                    <div onMouseDown={slider.handleSliderMouseDown} style={{
                                        flex: 1,

                                        height: 14,
                                        width: 25,

                                        cursor: "pointer",

                                        position: "relative"
                                    }}>

                                    </div>
                                </div>
                            </div>
                        </FlexLayout>
                    </FlexLayout>
                </TraxDialogPanel>
            </TraxDialog>
            
            {(slot.dragging && slot.set !== null && slot.slot !== null && slot.length !== null) && (
                <div ref={slotRef} style={{
                    position: "fixed",

                    display: "none",

                    transform: "translate(-12px, -12px)",

                    pointerEvents: "none",

                    flexDirection: "row",
                    gap: 1
                }}>
                    {Array(slot.length).fill(null).map((_, index) => (
                        <div className={`sprite_dialog_trax_samples_set_${sets.indexOf(slot.set) + 1}_sample_${(slot.slot ?? 0) + 1}`} style={{
                            position: "relative"
                        }}>
                            {(index !== (slot.length ?? 1) - 1) && (
                                <div className={`sprite_dialog_trax_samples_set_${sets.indexOf(slot.set) + 1}_connector`} style={{
                                    position: "absolute",

                                    right: -3,
                                    top: 0,

                                    zIndex: 1
                                }}/>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Fragment>
    );
}
