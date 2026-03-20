import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import FurnitureImage from "../FurnitureImage";
import { useCallback, useState } from "react";
import Input from "../../../Common/Form/Components/Input";
import Checkbox from "../../../Common/Form/Components/Checkbox";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import useFurnitureTypes from "../../../Hooks/Furniture/useFurnitureTypes";
import Selection from "../../../Common/Form/Components/Selection";
import { webSocketClient } from "../../../..";
import { FurnitureData, FurnitureFlagsData, UpdateFurnitureData } from "@pixel63/events";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type EditFurnitureDialogProps = {
    hidden?: boolean;
    data?: Partial<FurnitureData>;
    onClose?: () => void;
}

export default function EditFurnitureDialog({ hidden, data, onClose }: EditFurnitureDialogProps) {
    const dialogs = useDialogs();

    const { categories } = useFurnitureTypes();

    const [type, setType] = useState(data?.type);
    const [color, setColor] = useState(data?.color);

    const [name, setName] = useState(data?.name);
    const [description, setDescription] = useState(data?.description ?? "");
    const [category, setCategory] = useState(data?.category ?? "other");
    const [placement, setPlacement] = useState(data?.placement ?? "floor");
    const [interactionType, setInteractionType] = useState(data?.interactionType ?? "default");
    const [depth, setDepth] = useState<number>(data?.dimensions?.depth ?? 0);

    const [flags, setFlags] = useState(FurnitureFlagsData.create(data?.flags));

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateFurnitureData, UpdateFurnitureData.create({
            id: data?.id,

            type,
            color,

            name,
            description,

            placement,

            category,
            interactionType,

            flags,

            depth
        }));
    }, [ data, type, color, placement, name, description, category, interactionType, depth, flags ]);

    return (
        <Dialog title="Furniture Editor" hidden={hidden} onClose={onClose} initialPosition="center" width={720} height={420} style={{
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
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",

                        overflow: "hidden"
                    }}>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FurnitureImage key={type} furnitureData={FurnitureData.create({
                                type,
                                color
                            })}/>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            
                            width: "100%"
                        }}>
                            <div style={{ fontSize: 12 }}><i>There can only be one furniture entity with a unique type and color.</i></div>

                            <b>Furniture type</b>

                            <Input value={type} onChange={setType}/>
                            
                            <b>Furniture color</b>

                            <Input value={(color)?(color.toString()):(undefined)} onChange={(value) => setColor((value.length)?(parseInt(value)):(undefined))}/>

                            {(interactionType === "crackable") && (
                                <div>
                                    {(data?.id)?(
                                        <DialogButton onClick={() => {
                                            dialogs.addUniqueDialog("edit-furniture-crackable", {
                                                furniture: FurnitureData.create({
                                                    id: data.id,

                                                    name,
                                                    description,
                                                    
                                                    type,
                                                    color
                                                })
                                            });
                                        }}>
                                            Edit crackable data
                                        </DialogButton>
                                    ):(
                                        <p><i>Furniture must be created before crackable data can be changed.</i></p>
                                    )}
                                </div>
                            )}
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

                        <Input value={interactionType} onChange={setInteractionType}/>

                        <b>Depth {(flags.sitable)?(`(sit depth ${(depth - 0.5).toPrecision(3)})`):(null)}</b>

                        <Input type="number" step={0.1} value={depth.toString()} onChange={(value) => setDepth(parseFloat(value))}/>

                        <b>Furniture placement</b>

                        <Input value={placement} onChange={setPlacement}/>
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
                            <DialogButton onClick={handleApply}>{(data?.id)?("Update furniture"):("Create new furniture")}</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
