import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { act, Fragment, useEffect, useRef, useState } from "react";
import RoomCameraEditorRenderer from "@UserInterface/Components/Room/Camera/RoomCameraEditorRenderer";
import DialogSlider from "@UserInterface/Common/Dialog/Components/Slider/DialogSlider";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";

export type RoomCameraOptions = {
    zoomed: boolean;
    
    filters?: {
        sepia?: number;
        saturation?: number;
        contrast?: number;
        pale?: number;
    };

    frames?: {
        [key: string]: number | undefined;
    };
}

export type RoomCameraEditorDialogProps = {
    data: {
        image: string;
    };
    hidden?: boolean;
    onClose?: () => void;
}

const ROOM_CAMERA_FILTERS = [
    {
        tooltip: "Sepia",
        property: "sepia"
    },
    {
        tooltip: "Increase saturation",
        property: "saturation"
    },
    {
        tooltip: "Increase contrast",
        property: "contrast"
    },
    {
        tooltip: "Pale",
        property: "pale"
    }
];

const ROOM_CAMERA_FRAMES = [
    {
        tooltip: "Alien",
        image: "alien_hrd"
    },
    {
        tooltip: "Bluemood",
        image: "bluemood_mpl"
    },
    {
        tooltip: "Coffee",
        image: "coffee_mpl"
    },
    {
        tooltip: "Drops",
        image: "drops_mpl"
    },
    {
        tooltip: "Finger",
        image: "finger_nrm"
    },
    {
        tooltip: "Frame Black",
        image: "frame_black_2"
    },
    {
        tooltip: "Frame Gold 1",
        image: "frame_gold"
    },
    {
        tooltip: "Frame Gray 2",
        image: "frame_gray_2"
    },
    {
        tooltip: "Frame Gray 3",
        image: "frame_gray_3"
    },
    {
        tooltip: "Frame Gray 4",
        image: "frame_gray_4"
    },
    {
        tooltip: "Wood Frame",
        image: "frame_wood_2"
    },
    {
        tooltip: "Glitter",
        image: "glitter_hrd"
    },
    {
        tooltip: "Hearts",
        image: "hearts_hardlight_02"
    },
    {
        tooltip: "Misty",
        image: "misty_hrd"
    },
    {
        tooltip: "Pinky",
        image: "pinky_nrm"
    },
    {
        tooltip: "Rusty",
        image: "rusty_mpl"
    },
    {
        tooltip: "Security",
        image: "security_hardlight"
    },
    {
        tooltip: "Shadow",
        image: "shadow_multiply_02"
    },
    {
        tooltip: "Shiny",
        image: "shiny_hrd"
    },
    {
        tooltip: "Stars",
        image: "stars_hardlight_02"
    },
    {
        tooltip: "Texture",
        image: "texture_overlay"
    },
    {
        tooltip: "Toxic",
        image: "toxic_hrd"
    }
]

export default function RoomCameraEditorDialog({ data, hidden, onClose }: RoomCameraEditorDialogProps) {
    const [options, setOptions] = useState<RoomCameraOptions>({
        zoomed: false
    });

    const [activeFilter, setActiveFilter] = useState<number | null>(null);
    const [activeFrame, setActiveFrame] = useState<number | null>(null);

    if(!data) {
        return null;
    }

    const roomCameraEditorPreview = (
        <RoomCameraEditorPreview key={data.image} activeFilter={activeFilter} activeFrame={activeFrame} image={data.image} options={options} onOptionsChanged={setOptions} onClose={onClose}/>
    );

    return (
        <Dialog title="Room Camera Editor" hidden={hidden} onClose={onClose} width={580} height={460}>
            <DialogTabs
                style={{
                    marginLeft: 8
                }}
                withoutHeader
                tabs={[
                    {
                        icon: (<div className="sprite_room_camera_icon_colorfilter"/>),
                        element: (
                            <FlexLayout direction="row">
                                <div style={{
                                    flex: 1,

                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",

                                    height: "max-content"
                                }}>
                                    {ROOM_CAMERA_FILTERS.map((filter, index) => (
                                        <div key={index} data-tooltip={filter.tooltip} style={{
                                            width: 62,
                                            height: 62,

                                            position: "relative",

                                            cursor: "pointer"
                                        }} onClick={() => {
                                            if(options.filters?.[filter.property as keyof RoomCameraOptions["filters"]] === undefined) {
                                                setOptions({
                                                    ...options,
                                                    filters: {
                                                        ...options.filters,
                                                        [filter.property]: 50
                                                    }
                                                });
                                            }

                                            setActiveFilter(index);
                                            setActiveFrame(null);
                                        }}>
                                            <div style={{
                                                width: 56,
                                                height: 56,

                                                position: "absolute",

                                                left: 2,
                                                top: 2,

                                                border: "1px solid #000000"
                                            }}>
                                                <RoomCameraEditorRenderer size={56} image={data.image} options={{
                                                    zoomed: options.zoomed,
                                                    filters: {
                                                        [filter.property]: 100
                                                    }
                                                }}/>
                                            </div>

                                            {(activeFilter === index)?(
                                                <div className="sprite_room_camera_fx_button_selected" style={{
                                                    position: "absolute",

                                                    left: 0,
                                                    top: 0
                                                }}/>
                                            ):(
                                                ((options.filters?.[filter.property as keyof RoomCameraOptions["filters"]]) !== undefined) && (
                                                    <div className="sprite_room_camera_fx_button_active" style={{
                                                        position: "absolute",

                                                        left: 0,
                                                        top: 0
                                                    }}/>
                                                )
                                            )}

                                            {((options.filters?.[filter.property as keyof RoomCameraOptions["filters"]]) !== undefined) && (
                                                <div className="sprite_room_camera_remove" style={{
                                                    position: "absolute",

                                                    top: -2,
                                                    right: -6,

                                                    zIndex: 1,

                                                    cursor: "pointer"
                                                }} onClick={() => {
                                                    setOptions({
                                                        ...options,
                                                        filters: {
                                                            ...options.filters,
                                                            [filter.property]: undefined
                                                        }
                                                    });

                                                    setActiveFilter(null);
                                                }}/>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {roomCameraEditorPreview}
                            </FlexLayout>
                        )
                    },
                    
                    {
                        icon: (<div className="sprite_room_camera_icon_compositefilter"/>),
                        element: (
                            <FlexLayout direction="row">
                                <div style={{ flex: "1 1 0", height: 370, overflowY: "overlay" }}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                    }}>
                                        {ROOM_CAMERA_FRAMES.map((frame, index) => (
                                            <div key={index} data-tooltip={frame.tooltip} style={{
                                                width: 62,
                                                height: 62,

                                                position: "relative",

                                                cursor: "pointer"
                                            }} onClick={() => {
                                                if(options.frames?.[frame.image as keyof RoomCameraOptions["filters"]] === undefined) {
                                                    setOptions({
                                                        ...options,
                                                        frames: {
                                                            ...options.frames,
                                                            [frame.image]: 100
                                                        }
                                                    });
                                                }

                                                setActiveFrame(index);
                                                setActiveFilter(null);
                                            }}>
                                                <div style={{
                                                    width: 56,
                                                    height: 56,

                                                    position: "absolute",

                                                    left: 2,
                                                    top: 2,

                                                    border: "1px solid #000000"
                                                }}>
                                                    <RoomCameraEditorRenderer size={56} image={data.image} options={{
                                                        zoomed: options.zoomed,
                                                        frames: {
                                                            [frame.image]: 100
                                                        }
                                                    }}/>
                                                </div>

                                                {(activeFilter === index)?(
                                                    <div className="sprite_room_camera_fx_button_selected" style={{
                                                        position: "absolute",

                                                        left: 0,
                                                        top: 0
                                                    }}/>
                                                ):(
                                                    ((options.frames?.[frame.image]) !== undefined) && (
                                                        <div className="sprite_room_camera_fx_button_active" style={{
                                                            position: "absolute",

                                                            left: 0,
                                                            top: 0
                                                        }}/>
                                                    )
                                                )}

                                                {((options.frames?.[frame.image]) !== undefined) && (
                                                    <div className="sprite_room_camera_remove" style={{
                                                        position: "absolute",

                                                        top: -2,
                                                        right: -6,

                                                        zIndex: 1,

                                                        cursor: "pointer"
                                                    }} onClick={() => {
                                                        setOptions({
                                                            ...options,
                                                            frames: {
                                                                ...options.frames,
                                                                [frame.image]: undefined
                                                            }
                                                        });

                                                        setActiveFilter(null);
                                                    }}/>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                {roomCameraEditorPreview}
                            </FlexLayout>
                        )
                    }
                ]}/>
        </Dialog>
    );
}

export type RoomCameraEditorPreviewProps = {
    activeFilter: number | null;
    activeFrame: number | null;

    image: string;
    options: RoomCameraOptions;
    onOptionsChanged: (options: RoomCameraOptions) => void;
    onClose?: () => void;
}

export function RoomCameraEditorPreview({ activeFilter, activeFrame, image, options, onOptionsChanged, onClose }: RoomCameraEditorPreviewProps) {
    const dialogs = useDialogs();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <FlexLayout style={{
            marginTop: -50,
            marginRight: -12,

            padding: 12,

            zIndex: 1,

            background: "rgb(236, 234, 224)",
        }}>
            <div style={{
                border: "1px solid #000000",
                width: 320,
                height: 320,

                position: "relative"
            }}>
                <RoomCameraEditorRenderer canvasRef={canvasRef} image={image} options={options} size={320}/>

                {(activeFilter !== null) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        right: 0,

                        bottom: 0,

                        background: "rgba(0, 0, 0, .75)",
                        padding: 6,

                        color: "#FFFFFF"
                    }}>
                        <div style={{ textAlign: "center" }}><b>{ROOM_CAMERA_FILTERS[activeFilter].tooltip}</b></div>

                        <DialogSlider min={0} max={100} value={options.filters?.[ROOM_CAMERA_FILTERS[activeFilter].property as keyof RoomCameraOptions["filters"]] ?? 0} onChange={(value: number) => {
                            onOptionsChanged({
                                ...options,
                                filters: {
                                    ...options.filters,
                                    [ROOM_CAMERA_FILTERS[activeFilter].property as keyof RoomCameraOptions["filters"]]: value
                                }
                            });
                        }} style={{
                            filter: "none"
                        }}/>
                    </div>
                )}

                {(activeFrame !== null) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        right: 0,

                        bottom: 0,

                        background: "rgba(0, 0, 0, .75)",
                        padding: 6,

                        color: "#FFFFFF"
                    }}>
                        <div style={{ textAlign: "center" }}><b>{ROOM_CAMERA_FRAMES[activeFrame].tooltip}</b></div>

                        <DialogSlider min={0} max={100} value={options.frames?.[ROOM_CAMERA_FRAMES[activeFrame].image] ?? 0} onChange={(value: number) => {
                            onOptionsChanged({
                                ...options,
                                frames: {
                                    ...options.frames,
                                    [ROOM_CAMERA_FRAMES[activeFrame].image]: value
                                }
                            });
                        }} style={{
                            filter: "none"
                        }}/>
                    </div>
                )}
            </div>

            <FlexLayout direction="row" justify="space-between" align="center" style={{
                textDecoration: "underline"
            }}>
                <FlexLayout direction="row" align="center" style={{
                    cursor: "pointer"
                }} onClick={() => {
                    if(!canvasRef.current) {
                        return;
                    }

                    const link = document.createElement("a");
                    
                    link.download = "Room Camera.png";
                    link.href = canvasRef.current.toDataURL("image/png");

                    link.click();
                }}>
                    <div className="sprite_room_camera_save"/>

                    Save to computer
                </FlexLayout>

                <FlexLayout direction="row" align="center" style={{
                    cursor: "pointer"
                }} onClick={() => onOptionsChanged({ ...options, zoomed: !options.zoomed })}>
                    <div className="sprite_room_camera_zoom"/>

                    Zoom {(options.zoomed)?("out"):("in")}
                </FlexLayout>

            </FlexLayout>

            <div style={{ height: 6 }}/>

            <FlexLayout direction="row">
                <DialogButton style={{ flex: 1 }} onClick={onClose}>Cancel</DialogButton>

                <DialogButton style={{ flex: 1 }} color="green" onClick={() => {
                    onClose?.();

                    dialogs.openUniqueDialog("room-camera-preview", {
                        image,
                        options
                    });
                }}>
                    Preview
                </DialogButton>
            </FlexLayout>
        </FlexLayout>
    );
}
