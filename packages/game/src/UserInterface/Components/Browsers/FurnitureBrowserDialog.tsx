import { Fragment, useEffect, useState } from "react";
import { FurnitureBrowserData, FurnitureData, GetFurnitureBrowserData } from "@pixel63/events";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks/useDialogs";
import { usePermissionAction } from "../../Hooks/usePermissionAction";
import Input from "@UserInterface/Common/Form/Components/Input";
import BrowserDialog from "@UserInterface/Common/Browser/BrowserDialog";
import FurnitureImage from "@UserInterface/Components2/Furniture/FurnitureImage";
import FurnitureIcon from "@UserInterface/Components2/Furniture/FurnitureIcon";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export type FurnitureBrowserDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
    data?: {
        allowMultipleItems?: boolean;
        searchCustomParams?: string;

        activeFurniture?: FurnitureData[];
        onSelect?: (furniture: FurnitureData[]) => void;
    }
}

export default function FurnitureBrowserDialog({ data, hidden, onClose }: FurnitureBrowserDialogProps) {
    const dialogs = useDialogs();
    const hasEditPermissions = usePermissionAction("furniture:edit");
    
    const [items, setItems] = useState<FurnitureData[]>([]);
    const [activeItems, setActiveItems] = useState<FurnitureData[]>(data?.activeFurniture ?? []);
    
    const [state, setState] = useState(performance.now());
    
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    
    const [searchType, setSearchType] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchCustomParams, setSearchCustomParams] = useState(data?.searchCustomParams ?? "");

    const [animationId, setAnimationId] = useState<number>(0);
    const [frame, setFrame] = useState<number>(0);

    useEffect(() => {
        setPage(0);
    }, [searchType, searchName, searchCustomParams]);

    useEffect(() => {
        if(data?.searchCustomParams) {
            setSearchCustomParams(data.searchCustomParams);
        }
    }, [data?.searchCustomParams]);

    useEffect(() => {
        setAnimationId(0);
    }, [activeItems]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(FurnitureBrowserData, {
            async handle(payload: FurnitureBrowserData) {
                setItems(payload.furniture);
                setCount(payload.count);
            },
        });

        webSocketClient.sendProtobuff(GetFurnitureBrowserData, GetFurnitureBrowserData.create({
            offset: page * 20,

            searchType,
            searchName,
            searchCustomParams
        }));

        return () => {
            webSocketClient.removeProtobuffListener(FurnitureBrowserData, listener);
        };
    }, [ page, state, searchType, searchName, searchCustomParams ]);

    return (
        <BrowserDialog
            activeId={activeItems.map((item) => item.id)}

            count={count}
            page={page}

            preview={(activeItems.length === 1) && (
                <FlexLayout direction="row" align="center">
                    <FlexLayout align="center" justify="center" style={{ flex: 1 }}>
                        <FurnitureImage animation={animationId} frame={frame} furnitureData={activeItems[0]} spritesWithoutInkModes={false}/>
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
                        onClick: () => {
                            if(data?.allowMultipleItems) {
                                if(activeItems.includes(item)) {
                                    setActiveItems(activeItems.filter((activeItem) => activeItem.id !== item.id));
                                }
                                else {
                                    setActiveItems(activeItems.concat(item));
                                }
                            }
                            else {
                                setActiveItems((activeItems.includes(item)?([]):([item])));
                            }
                        }
                    };
                }),
                tools: (hasEditPermissions) && (
                    <div className="sprite_add" style={{
                        cursor: "pointer"
                    }} onClick={() => dialogs.addUniqueDialog("edit-furniture", { onClose: setState(performance.now()) })}/>
                )
            }}

            onSelect={(data?.onSelect) && ((id) => data?.onSelect?.(activeItems))}
            onPageChange={setPage}

            hidden={hidden}
            onClose={onClose}>
            <Input style={{ width: "100%" }} placeholder="Type" value={searchType} onChange={setSearchType}/>
            <Input style={{ width: "100%" }} placeholder="Name" value={searchName} onChange={setSearchName}/>
            <Input style={{ width: "100%" }} placeholder="Custom params" value={searchCustomParams} onChange={setSearchCustomParams}/>
        </BrowserDialog>
    );
}
