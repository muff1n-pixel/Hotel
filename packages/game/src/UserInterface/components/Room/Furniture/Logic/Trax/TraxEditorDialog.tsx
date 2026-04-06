import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { FurnitureTraxSongData, FurnitureTraxSetData, FurnitureTraxSongMetaData, UpdateRoomFurnitureTraxSongData } from "@pixel63/events";
import TraxButton from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxButton";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import TraxPlaylistSets from "@UserInterface/Components/Room/Furniture/Logic/Trax/Components/TraxPlaylistSets";
import useTrax from "@UserInterface/Components/Room/Furniture/Logic/Trax/Hooks/useTrax";
import useTraxSlider from "@UserInterface/Components/Room/Furniture/Logic/Trax/Hooks/useTraxSlider";
import useTraxSlot from "@UserInterface/Components/Room/Furniture/Logic/Trax/Hooks/useTraxSlot";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { webSocketClient } from "src";

export type TraxEditorDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
        song?: FurnitureTraxSongMetaData;
    };
    onClose?: () => void;
}

export default function TraxEditorDialog({ hidden, data, onClose }: TraxEditorDialogProps) {
    const dialogs = useDialogs();

    const containerRef = useRef<HTMLDivElement>(null);
    const slotRef = useRef<HTMLDivElement>(null);

    const audioContext = useRef<AudioContext>(new AudioContext());

    const [trax, setTrax] = useState<FurnitureTraxSongData>(FurnitureTraxSongData.fromJSON(data.song?.song ?? {}));

    const [offset, setOffset] = useState(0);

    const slider = useTraxSlider(offset);
    const player = useTrax(trax, slider.setSliderIndex);

    useEffect(() => {
        setTrax({
            ...trax,
            slots: trax.slots.filter((slot) => trax.sets.some((set) => set.index === slot.set))
        })
    }, [trax.sets]);

    const mappedSlots = useMemo(() => {
        return Array(4).fill(null).map((_, row) => {
            const rowSlots = trax.slots.filter((slot) => slot.row === row);

            return Array(24).fill(null).map((_, column) => {
                const columnWithOffset = column + offset;

                return rowSlots.find((slot) => columnWithOffset >= slot.column && columnWithOffset < slot.column + slot.duration);
            });
        });
    }, [trax.slots, offset]);

    const handleSetSlot = useCallback((set: FurnitureTraxSetData, slot: number, duration: number, row: number, column: number) => {
        const mutatedSlot = trax.slots.filter((slot) => {
            if(slot.row !== row) {
                return true;
            }

            if(slot.column + slot.duration - 1 < column) {
                return true;
            }

            if(slot.column > column + length - 1) {
                return true;
            }

            return false;
        });

        mutatedSlot.push({
            "$type": "FurnitureTraxSlotData",

            row,
            column,
            duration,
            
            set: set.index,
            slot
        });

        setTrax({
            ...trax,
            slots: mutatedSlot
        });
    }, [trax]);

    const handleRemoveSlot = useCallback((duration: number, row: number, column: number) => {
        const mutatedSlot = trax.slots.filter((slot) => {
            if(slot.row !== row) {
                return true;
            }

            if(slot.column + slot.duration - 1 < column) {
                return true;
            }

            if(slot.column > column + duration - 1) {
                return true;
            }

            return false;
        });

        setTrax({
            ...trax,
            slots: mutatedSlot
        });
    }, [trax]);

    const slot = useTraxSlot(containerRef, slotRef, handleSetSlot);

    const handleSave = useCallback(() => {
        dialogs.openUniqueDialog("trax-song-name", {
            roomFurniture: data.roomFurniture,
            song: {
                id: data.song?.id ?? undefined,
                name: data.song?.name ?? undefined,
                data: trax
            }
        });
    }, [trax, data, dialogs, onClose]);

    const handleClose = useCallback(() => {
        onClose?.();

        dialogs.openUniqueDialog("trax-playlists", {
            roomFurniture: data.roomFurniture
        });
    }, [dialogs, onClose]);

    return (
        <Fragment>
            <TraxDialog title={data.song?.name ?? "Trax Editor"} hidden={hidden} onClose={handleClose} width={590} height={340} initialPosition="center" style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <TraxPlaylistSets audioContext={audioContext} trax={trax} onTraxChange={setTrax} onDragSlot={slot.handleDragging}/>

                <FlexLayout direction="column" gap={0}>
                    <FlexLayout direction="row" gap={5} style={{
                        alignSelf: "flex-end",
                        paddingRight: 6
                    }}>
                        {(!player.playing)?(
                            <TraxButton type="bottom-off" onClick={player.handleStart} style={{ width: 54 }}>
                                <div className="sprite_dialog_trax_play"/>
                            </TraxButton>
                        ):(
                            <TraxButton type="bottom-off" onClick={player.handlePause} style={{ width: 54 }}>
                                <div className={(player.paused)?("sprite_dialog_trax_play"):("sprite_dialog_trax_pause")}/>
                            </TraxButton>
                        )}

                        <TraxButton type="bottom-off" onClick={player.handleStop} disabled={!player.playing} style={{ width: 54 }}>
                            <div className="sprite_dialog_trax_stop"/>
                        </TraxButton>

                        <TraxButton type="bottom-off" disabled={!trax.sets.length || !trax.slots.length} style={{ width: 54 }} onClick={handleSave}>
                            <div className="sprite_dialog_trax_save"/>
                        </TraxButton>

                        <TraxButton type="bottom-off" onClick={() => {
                            setTrax({
                                ...trax,
                                slots: []
                            });
                        }} style={{ padding: "0 4px" }}>
                            <div className="sprite_dialog_trax_trash"/>
                        </TraxButton>

                        <FlexLayout direction="row" gap={0}>
                            <TraxButton type="bottom-off" onClick={() => {
                                if(offset > 0) {
                                    setOffset(offset - 1);
                                    slider.setSliderIndex(Math.min(23, slider.sliderIndex + 1));
                                }
                            }} style={{ padding: "0 4px" }}>
                                <div className="sprite_dialog_trax_arrow-left-small"/>
                            </TraxButton>

                            <TraxButton type="bottom-off" onClick={() => {
                                setOffset(offset + 1);
                                slider.setSliderIndex(Math.max(0, slider.sliderIndex - 1));
                            }} style={{ padding: "0 4px" }}>
                                <div className="sprite_dialog_trax_arrow-right-small"/>
                            </TraxButton>
                        </FlexLayout>
                    </FlexLayout>

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

                                <div style={{ height: 10 }}/>
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
                                        {Array(24).fill(null).map((_, column) => {
                                            const offsetColumn = column + offset;

                                            const slot = mappedSlots[row][column];

                                            return (
                                                <div key={offsetColumn} className="sprite_dialog_trax_slot" data-trax-row={row} data-trax-slot={offsetColumn}>
                                                    {(slot) && (
                                                        <div className={`sprite_dialog_trax_samples_set_${slot.set + 1}_sample_${slot.slot + 1}`} style={{
                                                            position: "relative",
                                                            cursor: "pointer"
                                                        }} onClick={() => slot && handleRemoveSlot(slot.duration, slot.row, slot.column)}>
                                                            {(slot.set === mappedSlots[row][column + 1]?.set && slot.slot === mappedSlots[row][column + 1]?.slot) && (
                                                                <div className={`sprite_dialog_trax_samples_set_${slot.set + 1}_connector`} style={{
                                                                    position: "absolute",

                                                                    right: -3,
                                                                    top: 0,

                                                                    zIndex: 1
                                                                }}/>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </FlexLayout>
                                )))}

                                <div style={{
                                    position: "relative"
                                }}>
                                    <div ref={slider.sliderContainerRef} style={{
                                        height: 15,

                                        position: "absolute"
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

                                                bottom: 0,

                                                pointerEvents: "none"
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

                                    <div style={{
                                        position: "relative",
                                        width: "100%",
                                        height: 15,
                                        overflow: "hidden",
                                        fontSize: 9,
                                        color: "#97D5CE"
                                    }}>
                                        {Array(5).fill(null).map((_, index) => (
                                            <div key={index} style={{
                                                position: "absolute",

                                                left: (5 * 22) + (index * 5 * 22) - ((offset % 5) * 22),
                                                top: 3,

                                                transform: "translateX(-50%)",
                                                textAlign: "center",
                                                textWrap: "nowrap"
                                            }}>
                                                {new Date((Math.floor(offset / 5) + index + 1) * 10 * 1000).toISOString().slice(14, 19)}min
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FlexLayout>
                        </FlexLayout>
                    </TraxDialogPanel>
                </FlexLayout>
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
                    {Array(slot.length).fill(null).map((_, index) => slot.set && (
                        <div className={`sprite_dialog_trax_samples_set_${slot.set.index + 1}_sample_${(slot.slot ?? 0) + 1}`} style={{
                            position: "relative"
                        }}>
                            {(index !== (slot.length ?? 1) - 1) && (
                                <div className={`sprite_dialog_trax_samples_set_${slot.set.index + 1}_connector`} style={{
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
