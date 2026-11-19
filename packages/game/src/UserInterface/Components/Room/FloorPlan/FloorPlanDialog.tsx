import { useCallback, useEffect, useRef, useState } from "react";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import DialogItem from "../../../Common/Dialog/Components/Item/DialogItem";
import RoomFloorPlanEditor, { RoomFloorPlanTool } from "./RoomFloorPlanEditor";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Checkbox from "../../../Common/Form/Components/Checkbox";
import Selection from "../../../Common/Form/Components/Selection";
import Input from "../../../Common/Form/Components/Input";
import { RoomPositionOffsetData, RoomStructureData } from "@pixel63/events";
import { RoomFloorplanEditData } from "@pixel63/shared/Interfaces/Room/Floorplan/RoomFloorplanEditData";
import { useTranslation } from "react-i18next";

export type FloorPlanDialogProps = {
    data: {
        structure: RoomStructureData;
        onSave: (structure: RoomStructureData, offset: RoomPositionOffsetData) => void;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function FloorPlanDialog({ data, hidden, onClose }: FloorPlanDialogProps) {
    const [getTranslation] = useTranslation("room");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [floorPlanEditor, setFloorPlanEditor] = useState<RoomFloorPlanEditor | null>(null);

    const [activeDepth, setActiveDepth] = useState<number>(0);
    const [tool, setTool] = useState<RoomFloorPlanTool | null>(null);
    const [floorplanEditData, setFloorplanEditData] = useState<RoomFloorplanEditData | null>(null);

    const [direction, setDirection] = useState(2);

    const [floorThickness, setFloorThickness] = useState(8);
    const [wallThickness, setWallThickness] = useState(8);
    const [wallHidden, setWallHidden] = useState(false);
    const [wallHeight, setWallHeight] = useState(0);

    useEffect(() => {
        if(!canvasRef.current || floorPlanEditor) {
            return;
        }

        setFloorPlanEditor(new RoomFloorPlanEditor(canvasRef.current, setActiveDepth, setFloorplanEditData));
    }, [canvasRef, floorPlanEditor])

    useEffect(() => {
        if(!floorPlanEditor) {
            return;
        }

        return () => {
            floorPlanEditor.terminate();
        };
    }, [floorPlanEditor]);

    useEffect(() => {
        if(!floorPlanEditor || floorPlanEditor.data) {
            return;
        }

        floorPlanEditor.setStructure(data.structure);

        setDirection(data.structure.door?.direction ?? 2);

        setFloorThickness(data.structure.floor?.thickness ?? 8);
        setWallThickness(data.structure.wall?.thickness ?? 8);
        
        setWallHidden(data.structure.wall?.hidden ?? false);
        setWallHeight(data.structure.wall?.height ?? 0);
    }, [data, floorPlanEditor]);

    useEffect(() => {
        if(floorPlanEditor) {
            floorPlanEditor.tool = tool;
            floorPlanEditor.activeDepth = activeDepth;
        }
    }, [floorPlanEditor, tool, activeDepth]);

    const handleApply = useCallback(() => {
        if(!floorplanEditData) {
            return;
        }

        if(!floorPlanEditor) {
            return;
        }

        data.onSave(RoomStructureData.create({
            grid: floorplanEditData.structure.grid,
            door: {
                row: (floorplanEditData.structure.door?.row ?? 0),
                column: (floorplanEditData.structure.door?.column ?? 0),
                direction
            },
            wall: {
                id: data.structure.wall?.id,
                thickness: wallThickness,
                height: wallHeight,
                hidden: wallHidden
            },
            floor: {
                id: data.structure.floor?.id,
                thickness: floorThickness,
            }
        }), floorplanEditData.offsets);

        floorPlanEditor.setStructure(floorplanEditData.structure);
    }, [data, floorPlanEditor, floorplanEditData, direction, wallHidden, wallThickness, wallHeight, floorThickness]);

    return (
        <Dialog title={getTranslation("floorplan.title")} hidden={hidden} onClose={onClose} initialPosition="center" width={840} height={440}>
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "row",
                    gap: 10
                }}>
                    <div style={{
                        flex: 3,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "row",
                            gap: 10,

                            alignItems: "flex-end",

                            padding: 10,

                            position: "relative"
                        }}>
                            <div style={{
                                position: "absolute",

                                left: 0,
                                top: 0,

                                width: "100%",
                                height: "100%",

                                borderRadius: 5,
                                overflow: "hidden"
                            }}>
                                <canvas ref={canvasRef}/>
                            </div>

                            <div style={{
                                flex: 1,
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    gap: 5
                                }}>
                                    <DialogItem width={44} active={tool === "add_tile"} onClick={() => setTool((tool === "add_tile")?(null):("add_tile"))}>
                                        <div className="sprite_room_floorplan_add_tile"/>
                                    </DialogItem>
                                    
                                    <DialogItem width={44} active={tool === "remove_tile"} onClick={() => setTool((tool === "remove_tile")?(null):("remove_tile"))}>
                                        <div className="sprite_room_floorplan_remove_tile"/>
                                    </DialogItem>
                                    
                                    <DialogItem width={44} active={tool === "raise_tile"} onClick={() => setTool((tool === "raise_tile")?(null):("raise_tile"))}>
                                        <div className="sprite_room_floorplan_raise_tile"/>
                                    </DialogItem>
                                    
                                    <DialogItem width={44} active={tool === "sink_tile"} onClick={() => setTool((tool === "sink_tile")?(null):("sink_tile"))}>
                                        <div className="sprite_room_floorplan_sink_tile"/>
                                    </DialogItem>
                                    
                                    <DialogItem width={44} active={tool === "enter_tile"} onClick={() => setTool((tool === "enter_tile")?(null):("enter_tile"))}>
                                        <div className="sprite_room_floorplan_enter_tile"/>
                                    </DialogItem>
                                    
                                    <DialogItem width={44} active={tool === "tile_picker"} onClick={() => setTool((tool === "tile_picker")?(null):("tile_picker"))}>
                                        <div className="sprite_room_floorplan_tile_picker"/>
                                    </DialogItem>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            {Array(31).fill(null).map((_, depth) => (
                                <div key={depth} style={{
                                    flex: 1,

                                    height: 20,

                                    backgroundColor: "hsl(" + (360 - ((360 / 100) * (34 + ((1 + depth) * 3)))) + ", 100%, 50%)",

                                    position: "relative",
                                    cursor: "pointer"
                                }} onClick={() => setActiveDepth(depth)}>
                                    {(activeDepth === depth) && (
                                        <div style={{
                                            position: "absolute",

                                            left: -2,
                                            top: -2,

                                            width: "100%",
                                            height: "100%",

                                            border: "2px solid #FFFFFF",
                                            zIndex: 1,

                                            boxShadow: "0 0 0 1px rgba(0, 0, 0, .1)"
                                        }}>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        flex: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 10
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10
                            }}>
                                <b>{getTranslation("floorplan.door_direction")}</b>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <div className={`sprite_room_floorplan_door_direction_${direction}`} style={{
                                        cursor: "pointer"
                                    }} onClick={() => setDirection((direction + 1) % 8)}/>
                                </div>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10
                            }}>
                                <b>{getTranslation("floorplan.floor_and_walls")}</b>
                
                                <Selection value={floorThickness} items={[
                                    {
                                        value: 0,
                                        label: getTranslation("floorplan.thinnest_floor")
                                    },
                                    {
                                        value: 4,
                                        label: getTranslation("floorplan.thin_floor")
                                    },
                                    {
                                        value: 8,
                                        label: getTranslation("floorplan.normal_floor")
                                    },
                                    {
                                        value: 12,
                                        label: getTranslation("floorplan.thick_floor")
                                    },
                                    {
                                        value: 16,
                                        label: getTranslation("floorplan.thickest_floor")
                                    }
                                ]} onChange={(value) => setFloorThickness(value as number)}/>
                                
                                <Selection value={wallThickness} items={[
                                    {
                                        value: 0,
                                        label: getTranslation("floorplan.thinnest_walls")
                                    },
                                    {
                                        value: 4,
                                        label: getTranslation("floorplan.thin_walls")
                                    },
                                    {
                                        value: 8,
                                        label: getTranslation("floorplan.normal_walls")
                                    },
                                    {
                                        value: 12,
                                        label: getTranslation("floorplan.thick_walls")
                                    },
                                    {
                                        value: 16,
                                        label: getTranslation("floorplan.thickest_walls")
                                    }
                                ]} onChange={(value) => setWallThickness(value as number)}/>
                
                                <Checkbox label={getTranslation("floorplan.hide_walls")} value={wallHidden} onChange={setWallHidden}/>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10
                            }}>
                                <b>{getTranslation("floorplan.wall_height")}</b>

                                <Input type="number" value={wallHeight.toString()} onChange={(value) => setWallHeight(parseInt(value))} min={0} max={10}/>
                            </div>

                            <div/>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <DialogButton onClick={handleApply}>{getTranslation("floorplan.apply")}</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
