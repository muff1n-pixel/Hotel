import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { Fragment, useRef, useState } from "react";
import RoomCameraEditorRenderer from "@UserInterface/Components/Room/Camera/RoomCameraEditorRenderer";
import DialogSlider from "@UserInterface/Common/Dialog/Components/Slider/DialogSlider";

export type RoomCameraOptions = {
    zoomed: boolean;
    
    filters?: {
        sepia?: number;
        saturation?: number;
        contrast?: number;
        pale?: number;
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

export default function RoomCameraEditorDialog({ data, hidden, onClose }: RoomCameraEditorDialogProps) {
    const [options, setOptions] = useState<RoomCameraOptions>({
        zoomed: false
    });

    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    if(!data) {
        return null;
    }

    const roomCameraEditorPreview = (
        <RoomCameraEditorPreview key={data.image} activeFilter={activeFilter} image={data.image} options={options} onOptionsChanged={setOptions}/>
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
                                <div style={{ flex: 1 }}>
                                    test
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

    image: string;
    options: RoomCameraOptions;
    onOptionsChanged: (options: RoomCameraOptions) => void;
}

export function RoomCameraEditorPreview({ activeFilter, image, options, onOptionsChanged }: RoomCameraEditorPreviewProps) {
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
                <DialogButton style={{ flex: 1 }}>Cancel</DialogButton>

                <DialogButton style={{ flex: 1 }} color="green">Preview</DialogButton>
            </FlexLayout>
        </FlexLayout>
    );
}
