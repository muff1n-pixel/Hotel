import RoomClickEvent from "@Client/Events/RoomClickEvent";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import Dialog from "../../../Dialog/Dialog";
import DialogContent from "../../../Dialog/DialogContent";
import DialogTable from "../../../Dialog/Table/DialogTable";
import Input from "../../../Form/Input";
import { useState } from "react";
import Selection from "../../../Form/Selection";

export type RoomFurnitureDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomFurnitureDialog({ hidden, onClose }: RoomFurnitureDialogProps) {
    const room = useRoomInstance();

    const [placement, setPlacement] = useState("all");
    const [search, setSearch] = useState("");

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
                            if(!furniture.data.furniture?.name.toLowerCase().includes(search.toLowerCase()) && (!furniture.data.furniture?.description || !furniture.data.furniture?.description?.toLowerCase().includes(search.toLowerCase()))) {
                                return false;
                            }
                        }

                        if(placement !== "all") {
                            if(furniture.data.furniture?.placement !== placement) {
                                return false;
                            }
                        }

                        return true;
                    }).map((furniture) => {
                        return {
                            id: furniture.data.id,
                            values: [
                                furniture.data.furniture?.name,
                                furniture.data.position && `X: ${Math.round(furniture.data.position.row)} Y: ${Math.round(furniture.data.position.column)} Z: ${Math.round(furniture.data.position.depth)}`
                            ],
                            onClick: () => {
                                room.roomRenderer.cursor?.dispatchEvent(new RoomClickEvent(null, {
                                    item: furniture.item
                                }))
                            }
                        };
                    })
                }/>
            </DialogContent>
        </Dialog>
    );
}
