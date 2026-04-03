import { FurnitureData } from "@pixel63/events";
import TraxDialogPanel from "@UserInterface/Common/Dialog/Layouts/Trax/Components/TraxDialogPanel";
import TraxDialog from "@UserInterface/Common/Dialog/Layouts/Trax/TraxDialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import TraxPlaylistSets from "@UserInterface/Components/Room/Furniture/Logic/Trax/Components/TraxPlaylistSets";
import useTraxSlider from "@UserInterface/Components/Room/Furniture/Logic/Trax/Hooks/useTraxSlider";
import { useState } from "react";

export type TraxPlaylistDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function TraxPlaylistDialog({ hidden, onClose }: TraxPlaylistDialogProps) {
    const slider = useTraxSlider();

    const [sets, setSets] = useState<(FurnitureData | null)[]>(Array(4).fill(null));

    return (
        <TraxDialog title="Trax Editor" hidden={hidden} onClose={onClose} width={590} height={350} initialPosition="center" style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <TraxPlaylistSets sets={sets} onSetsChange={setSets}/>

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

                    <FlexLayout direction="column" gap={2}>
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
                                    <div key={column} className="sprite_dialog_trax_slot"/>
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
                                left: slider.sliderIndex * 22
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
    );
}
