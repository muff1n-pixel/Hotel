import { Fragment, useEffect, useState } from "react";
import { FurnitureBrowserData, FurnitureData, GetFurnitureBrowserData } from "@pixel63/events";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks/useDialogs";
import { usePermissionAction } from "../../Hooks/usePermissionAction";
import Input from "@UserInterface/Common/Form/Components/Input";
import BrowserDialog from "@UserInterface/Common/Browser/BrowserDialog";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import FurnitureIcon from "@UserInterface/Components/Furniture/FurnitureIcon";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export type FurnitureBrowserDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
    data?: {
        activeFurniture?: FurnitureData;
        onSelect?: (furniture: FurnitureData) => void;
    }
}

export default function FurnitureBrowserDialog({ data, hidden, onClose }: FurnitureBrowserDialogProps) {
    const dialogs = useDialogs();
    const hasEditPermissions = usePermissionAction("furniture:edit");
    
    const [items, setItems] = useState<FurnitureData[]>([]);
    const [activeItem, setActiveItem] = useState<FurnitureData | null>(data?.activeFurniture ?? null);
    
    const [state, setState] = useState(performance.now());
    
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    
    const [searchId, setSearchId] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchName, setSearchName] = useState("");

    const [animationId, setAnimationId] = useState<number>(0);
    const [frame, setFrame] = useState<number>(0);

    useEffect(() => {
        setPage(0);
    }, [searchId, searchType, searchName]);

    useEffect(() => {
        setAnimationId(0);
    }, [activeItem]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(FurnitureBrowserData, {
            async handle(payload: FurnitureBrowserData) {
                setItems(payload.furniture);
                setCount(payload.count);
            },
        });

        webSocketClient.sendProtobuff(GetFurnitureBrowserData, GetFurnitureBrowserData.create({
            offset: page * 20,

            searchId,
            searchType,
            searchName
        }));

        return () => {
            webSocketClient.removeProtobuffListener(FurnitureBrowserData, listener);
        };
    }, [ page, state, searchId, searchType, searchName ]);

    return (
        <BrowserDialog
            activeId={activeItem?.id ?? null}

            count={count}
            page={page}

            preview={(activeItem) && (
                <FlexLayout direction="row" align="center">
                    <FlexLayout align="center" justify="center" style={{ flex: 1 }}>
                        <FurnitureImage animation={animationId} frame={frame} furnitureData={activeItem}/>
                    </FlexLayout>

                    <div style={{ flex: 3 }}/>

                    <div style={{ flex: 2 }}>
                        <div>
                            <b>Animation:</b>
                            <Input style={{ width: "100%" }} type="number" value={animationId.toString()} onChange={(value) => setAnimationId(parseInt(value))}/>
                        </div>
                        
                        <div>
                            <b>Frame:</b>
                            <Input style={{ width: "100%" }} type="number" value={frame.toString()} onChange={(value) => setFrame(parseInt(value))}/>
                        </div>
                    </div>
                </FlexLayout>
            )}

            table={{
                flex: [1, 1, 2],
                columns: ["Type", "Name", "Color"],
                items: items.map((item) => {
                    return {
                        id: item.id,
                        values: [
                            (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 5
                                }}>
                                    <div style={{ minWidth: 40 }}>
                                        <FurnitureIcon furnitureData={item}/>
                                    </div>

                                    {item.type}
                                </div>
                            ),
                            item.name ?? null,
                            item.color ?? null
                        ],
                        tools: (hasEditPermissions) && (
                            <Fragment>
                                <div className="sprite_room_user_motto_pen" style={{
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-furniture", { ...item, onClose: setState(performance.now()) })}/>
                                
                                <div className="sprite_add" style={{
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-furniture", { ...item, id: undefined, onClose: setState(performance.now()) })}/>
                            </Fragment>
                        ),
                        onClick: () => setActiveItem(item)
                    };
                }),
                tools: (hasEditPermissions) && (
                    <div className="sprite_add" style={{
                        cursor: "pointer"
                    }} onClick={() => dialogs.addUniqueDialog("edit-furniture", { onClose: setState(performance.now()) })}/>
                )
            }}

            onSelect={(data?.onSelect) && ((id) => data?.onSelect?.(items.find((pet) => pet.id === id)!))}
            onPageChange={setPage}

            hidden={hidden}
            onClose={onClose}>
            <Input style={{ width: "100%" }} placeholder="ID" value={searchId} onChange={setSearchId}/>
            <Input style={{ width: "100%" }} placeholder="Type" value={searchType} onChange={setSearchType}/>
            <Input style={{ width: "100%" }} placeholder="Name" value={searchName} onChange={setSearchName}/>
        </BrowserDialog>
    );
}
