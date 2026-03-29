import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import Dialog from "../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../Common/Dialog/Components/DialogContent";
import DialogTable from "../../../../Common/Dialog/Components/Table/DialogTable";
import Input from "../../../../Common/Form/Components/Input";
import { useState } from "react";
import Selection from "../../../../Common/Form/Components/Selection";
import { clientInstance } from "src";

export type RoomFurnitureDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomFurnitureDialog({ hidden, onClose }: RoomFurnitureDialogProps) {
    const room = useRoomInstance();

    const [placement, setPlacement] = useState("all");
    const [search, setSearch] = useState("");

    const [row, setRow] = useState("");
    const [column, setColumn] = useState("");
    const [depth, setDepth] = useState("");

    return (
        <Dialog title="Room Furniture" hidden={hidden} onClose={onClose} width={410} height={350} initialPosition="center">
            <DialogContent style={{
                gap: 10
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10
                }}>
                    <div style={{ flex: 2 }}>
                        <Input placeholder="Search" value={search} onChange={setSearch}/>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Selection value={placement} items={[
                            {
                                value: "all",
                                label: "All furniture"
                            },
                            {
                                value: "floor",
                                label: "Floor furniture"
                            },
                            {
                                value: "wall",
                                label: "Wall furniture"
                            }
                        ]} onChange={(value) => setPlacement(value as string)}/>
                    </div>
                </div>

                <DialogTable columns={["Furniture", "Position"]} items={
                    room?.furnitures.filter((furniture) => {
                        if(search) {
                            if(!furniture.furnitureData.name.toLowerCase().includes(search.toLowerCase()) && (!furniture.furnitureData.description || !furniture.furnitureData.description?.toLowerCase().includes(search.toLowerCase()))) {
                                return false;
                            }
                        }

                        if(placement !== "all") {
                            if(furniture.furnitureData.placement !== placement) {
                                return false;
                            }
                        }

                        return true;
                    }).filter((furniture) => {
                        if(!furniture.item.position) {
                            return true;
                        }

                        if(row.length && !window.isNaN(parseInt(row))) {
                            if(furniture.item.position.row !== parseInt(row)) {
                                return false;
                            }
                        }

                        if(column.length && !window.isNaN(parseInt(column))) {
                            if(furniture.item.position.column !== parseInt(column)) {
                                return false;
                            }
                        }

                        if(depth.length && !window.isNaN(parseInt(depth))) {
                            if(furniture.item.position.depth !== parseInt(depth)) {
                                return false;
                            }
                        }

                        return true;
                    }).map((furniture) => {
                        return {
                            id: furniture.data.id,
                            values: [
                                furniture.furnitureData.name,
                                furniture.item.position && `X: ${Math.round(furniture.item.position.row)} Y: ${Math.round(furniture.item.position.column)} Z: ${Math.round(furniture.item.position.depth)}`
                            ],
                            onClick: () => {
                                if(clientInstance.roomInstance.value) {
                                    clientInstance.roomInstance.value.roomRenderer.focusedItem.value = furniture.item;
                                    clientInstance.roomInstance.update();
                                }
                            }
                        };
                    })
                }/>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: 13,
                    gap: 10
                }}>
                    <div>Position</div>

                    <Input style={{ width: 40 }} placeholder="0" value={row} onChange={setRow}/>
                    <Input style={{ width: 40 }} placeholder="0" value={column} onChange={setColumn}/>
                    <Input style={{ width: 40 }} placeholder="0" value={depth} onChange={setDepth}/>
                </div>
            </DialogContent>
        </Dialog>
    );
}
