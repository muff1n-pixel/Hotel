import { FurnitureData } from "@pixel63/events";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

import "./TraxDialogSet.css";

export type TraxDialogSetProps = {
    slot: number;
    set?: FurnitureData;

    onEjectClick?: () => void;
    onDragSlot?: (slot: number) => void;
}

export default function TraxDialogSet({ slot, set, onEjectClick, onDragSlot }: TraxDialogSetProps) {
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
                        <div className="trax-dialog-set-name">{set.name}</div>
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
                            }} onMouseDown={() => onDragSlot?.(index)}>
                                <div className={`sprite_dialog_trax_samples_set_${slot + 1}_sample_${index + 1}`}/>
                            </div>
                        ))}
                    </div>
                </FlexLayout>
            </TraxDialogPanel>
        </FlexLayout>
    );
}
