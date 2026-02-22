import { useCallback, useEffect, useRef, useState } from "react";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import DialogItem from "../../Dialog/Item/DialogItem";
import RoomFloorPlanEditor, { RoomFloorPlanTool } from "./RoomFloorPlanEditor";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import DialogButton from "../../Dialog/Button/DialogButton";
import { webSocketClient } from "../../../..";
import { RoomFloorplanEditData } from "@Shared/Interfaces/Room/Floorplan/RoomFloorplanEditData";
import { UpdateRoomFloorplanEventData } from "@Shared/Communications/Requests/Rooms/Floorplan/UpdateRoomFloorplanEventData";
import Checkbox from "../../Form/Checkbox";
import Selection from "../../Form/Selection";
import Input from "../../Form/Input";

export type RoomFloorPlanDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomFloorPlanDialog({ hidden, onClose }: RoomFloorPlanDialogProps) {
    const room = useRoomInstance();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [floorPlanEditor, setFloorPlanEditor] = useState<RoomFloorPlanEditor | null>(null);

    const [activeDepth, setActiveDepth] = useState<number>(0);
    const [tool, setTool] = useState<RoomFloorPlanTool | null>(null);
    const [data, setData] = useState<RoomFloorplanEditData | null>(null);

    const [direction, setDirection] = useState(2);

    const [floorThickness, setFloorThickness] = useState(8);
    const [wallThickness, setWallThickness] = useState(8);
    const [wallHidden, setWallHidden] = useState(false);
    const [wallHeight, setWallHeight] = useState(0);

    useEffect(() => {
        if(!canvasRef.current) {
            return;
        }

        setFloorPlanEditor(new RoomFloorPlanEditor(canvasRef.current, setActiveDepth, setData));
    }, [canvasRef])

    useEffect(() => {
        if(!floorPlanEditor) {
            return;
        }

        return () => {
            floorPlanEditor.terminate();
        };
    }, [floorPlanEditor]);

    useEffect(() => {
        if(!floorPlanEditor) {
            return;
        }

        if(!room) {
            return;
        }

        floorPlanEditor.setStructure(room.roomRenderer.structure);

        setDirection(room.roomRenderer.structure.door?.direction ?? 2);

        setFloorThickness(room.roomRenderer.structure.floor.thickness);
        setWallThickness(room.roomRenderer.structure.wall.thickness);
        
        setWallHidden(room.roomRenderer.structure.wall.hidden);
        setWallHeight(room.roomRenderer.structure.wall.height ?? 0);
    }, [room, floorPlanEditor]);

    useEffect(() => {
        if(floorPlanEditor) {
            floorPlanEditor.tool = tool;
            floorPlanEditor.activeDepth = activeDepth;
        }
    }, [floorPlanEditor, tool, activeDepth]);

    const handleApply = useCallback(() => {
        if(!data) {
            return;
        }

        if(!floorPlanEditor) {
            return;
        }

        webSocketClient.send<UpdateRoomFloorplanEventData>("UpdateRoomFloorplanEvent", {
            offsets: data.offsets,
            grid: data.structure.grid,
            door: {
                row: (data.structure.door?.row ?? 0),
                column: (data.structure.door?.column ?? 0),
                direction
            },

            wallThickness,
            wallHidden,
            wallHeight,

            floorThickness
        });

        floorPlanEditor.setStructure(data.structure);
    }, [floorPlanEditor, data, direction, wallHidden, wallThickness, wallHeight, floorThickness]);

    return (
        <Dialog title="Room Floorplan" hidden={hidden} onClose={onClose} initialPosition="center" width={700} height={400}>
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
                                <b>Door direction</b>

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
                                <b>Floor and walls</b>
                
                                <Selection value={floorThickness} items={[
                                    {
                                        value: 0,
                                        label: "Thinnest floor"
                                    },
                                    {
                                        value: 4,
                                        label: "Thin floor"
                                    },
                                    {
                                        value: 8,
                                        label: "Normal floor"
                                    },
                                    {
                                        value: 12,
                                        label: "Thick floor"
                                    },
                                    {
                                        value: 16,
                                        label: "Thickest floor"
                                    }
                                ]} onChange={(value) => setFloorThickness(value as number)}/>
                                
                                <Selection value={wallThickness} items={[
                                    {
                                        value: 0,
                                        label: "Thinnest walls"
                                    },
                                    {
                                        value: 4,
                                        label: "Thin walls"
                                    },
                                    {
                                        value: 8,
                                        label: "Normal walls"
                                    },
                                    {
                                        value: 12,
                                        label: "Thick walls"
                                    },
                                    {
                                        value: 16,
                                        label: "Thickest walls"
                                    }
                                ]} onChange={(value) => setWallThickness(value as number)}/>
                
                                <Checkbox label="Hide room walls" value={wallHidden} onChange={setWallHidden}/>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10
                            }}>
                                <b>Wall height</b>

                                <Input type="number" value={wallHeight.toString()} onChange={(value) => setWallHeight(parseInt(value))} min={0} max={10}/>
                            </div>

                            <div/>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <DialogButton onClick={handleApply}>Apply</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
