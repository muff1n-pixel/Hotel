import { FurnitureTraxSetData } from "@pixel63/events";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

import "./TraxDialogSet.css";
import { useCallback } from "react";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";

export type TraxDialogSetProps = {
    audioContext: React.RefObject<AudioContext>;

    slot: number;
    set?: FurnitureTraxSetData;

    onEjectClick?: () => void;
    onDragSlot?: (slot: number) => void;
}

export default function TraxDialogSet({ audioContext, slot, set, onEjectClick, onDragSlot }: TraxDialogSetProps) {
    const handlePlayback = useCallback((set: FurnitureTraxSetData, index: number) => {
        if(!set.furniture) {
            return;
        }

        FurnitureAssets.getFurnitureData(set.furniture.type).then((furnitureData) => {
            if(audioContext.current.state !== "closed") {
                audioContext.current.close();
            }

            audioContext.current = new AudioContext();

            const gainNode = audioContext.current.createGain();

            const furnitureSound = furnitureData.sounds?.[index];

            if(!furnitureSound) {
                console.error("Sound does not exist in furniture!");

                return;
            }

            FurnitureAssets.getFurnitureAudioBuffer(audioContext.current, furnitureData.index.type, furnitureSound.file).then((audioBuffer) => {
                console.log("Adding buffer");

                
                const source = audioContext.current.createBufferSource();
                source.buffer = audioBuffer;

                source.connect(gainNode);

                gainNode.connect(audioContext.current.destination);
                gainNode.gain.setValueAtTime(0.03, audioContext.current.currentTime);

                source.start(audioContext.current.currentTime);
            });
        });

    }, [audioContext]);

    const handleStopPlayback = useCallback(() => {
        audioContext.current.suspend();
    }, [audioContext]);

    return (
        <FlexLayout direction="column" gap={0}>
            <FlexLayout align="center" justify="center" className={`trax-dialog-set-header ${(set)?("sprite_dialog_trax_set_header"):("sprite_dialog_trax_set_header_inactive")}`} onClick={onEjectClick} style={{
                color: ["#89DC00", "#EFB100", "#EF00B8", "#00D2DC"].at(slot),
                fontSize: 10,
                fontFamily: "Ubuntu Bold",
                textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000"
            }}>
                {(set) && (
                    <div>
                        <div className="trax-dialog-set-name">{set.furniture?.name}</div>
                        <div className="trax-dialog-set-eject">Eject</div>
                    </div>
                )}
            </FlexLayout>

            <TraxDialogPanel type="top-off" style={{
                paddingTop: 8,
                paddingBottom: 8
            }}>
                <FlexLayout justify="center" align="center">
                    <div className="sprite_dialog_trax_set_grid" style={{
                        position: "relative"
                    }}>
                        {set && Array(9).fill(null).map((_, index) => (
                            <div key={index} style={{
                                position: "absolute",

                                top: 2 + (24 * (Math.floor(index / 3))),
                                left: 2 + ((index - (Math.floor(index / 3) * 3)) * 24),

                                cursor: "grab"
                            }} onMouseDown={() => onDragSlot?.(index)} onMouseEnter={() => handlePlayback(set, index)} onMouseLeave={handleStopPlayback}>
                                <div className={`sprite_dialog_trax_samples_set_${slot + 1}_sample_${index + 1}`}/>
                            </div>
                        ))}
                    </div>
                </FlexLayout>
            </TraxDialogPanel>
        </FlexLayout>
    );
}
