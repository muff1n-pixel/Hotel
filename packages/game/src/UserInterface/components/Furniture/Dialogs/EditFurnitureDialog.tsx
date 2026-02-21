import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import FurnitureImage from "../FurnitureImage";
import { useCallback, useState } from "react";
import Input from "../../Form/Input";
import Checkbox from "../../Form/Checkbox";
import DialogButton from "../../Dialog/Button/DialogButton";
import useFurnitureTypes from "../../../hooks/Furniture/useFurnitureTypes";
import Selection from "../../Form/Selection";
import { webSocketClient } from "../../../..";
import { UpdateFurnitureEventData } from "@Shared/Communications/Requests/Furniture/UpdateFurnitureEventData";

export type EditFurnitureDialogProps = {
    hidden?: boolean;
    data: FurnitureData;
    onClose?: () => void;
}

export default function EditFurnitureDialog({ hidden, data, onClose }: EditFurnitureDialogProps) {
    const { categories, interactionTypes } = useFurnitureTypes();

    const [name, setName] = useState(data.name);
    const [description, setDescription] = useState(data.description ?? "");
    const [category, setCategory] = useState(data.category);
    const [interactionType, setInteractionType] = useState(data.interactionType);
    const [depth, setDepth] = useState<number>(data.dimensions.depth);

    const [flags, setFlags] = useState(data.flags);

    const handleApply = useCallback(() => {
        webSocketClient.send<UpdateFurnitureEventData>("UpdateFurnitureEvent", {
            furnitureId: data.id,

            name,
            description,

            category,
            interactionType,

            flags,
            depth
        });
    }, [ data, name, description, category, interactionType, depth, flags ]);

    return (
        <Dialog title="Furniture Editor" hidden={hidden} onClose={onClose} initialPosition="center" width={720} height={350} style={{
            overflow: "visible"
        }}>
            <DialogContent>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 20
                }}>
                    <div style={{
                        flex: 2,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        overflow: "hidden"
                    }}>
                        <div>
                            <FurnitureImage furnitureData={data}/>
                        </div>
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>Furniture name</b>

                        <Input value={name} onChange={setName}/>

                        <b>Furniture description</b>

                        <Input value={description} onChange={setDescription}/>

                        <b>Category (logic)</b>

                        <Selection value={category} items={categories.map((category) => {
                            return {
                                label: category,
                                value: category
                            };
                        })} onChange={(category) => setCategory(category as string)}/>

                        <b>Interaction type (logic)</b>

                        <Selection value={interactionType} items={interactionTypes.map((interactionType) => {
                            return {
                                label: interactionType,
                                value: interactionType
                            };
                        })} onChange={(interactionType) => setInteractionType(interactionType as string)}/>

                        <b>Depth {(flags.sitable)?(`(sit depth ${(depth - 0.5).toPrecision(3)})`):(null)}</b>

                        <Input type="number" step={0.1} value={depth.toString()} onChange={(value) => setDepth(parseFloat(value))}/>
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>Furniture flags</b>

                        <Checkbox value={flags.stackable} onChange={(value) => setFlags({ ...flags, stackable: value })} label="Is stackable with other furniture?"/>
                        
                        <Checkbox value={flags.sitable} onChange={(value) => setFlags({ ...flags, sitable: value })} label="Is sitable by users?"/>
                            
                        <Checkbox value={flags.layable} onChange={(value) => setFlags({ ...flags, layable: value })} label="Is layable by users?"/>

                        <Checkbox value={flags.walkable} onChange={(value) => setFlags({ ...flags, walkable: value })} label="Is walkable by users?"/>

                        <Checkbox value={flags.giftable} onChange={(value) => setFlags({ ...flags, giftable: value })} label="Is giftable by users?"/>

                        <Checkbox value={flags.tradable} onChange={(value) => setFlags({ ...flags, tradable: value })} label="Is tradable by users?"/>

                        <Checkbox value={flags.recyclable} onChange={(value) => setFlags({ ...flags, recyclable: value })} label="Is recycable by users?"/>
                        
                        <Checkbox value={flags.sellable} onChange={(value) => setFlags({ ...flags, sellable: value })} label="Is sellable by users?"/>

                        <Checkbox value={flags.inventoryStackable} onChange={(value) => setFlags({ ...flags, inventoryStackable: value })} label="Stacks in user inventory?"/>

                        <div style={{ flex: 1 }}/>

                        <div>
                            <DialogButton onClick={handleApply}>Apply</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
