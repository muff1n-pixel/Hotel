import { Fragment, useEffect, useState } from "react";
import { BadgeBrowserData, BadgeData, GetBadgeBrowserData } from "@pixel63/events";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks2/useDialogs";
import { usePermissionAction } from "../../Hooks2/usePermissionAction";
import Input from "@UserInterface/Common/Form/Components/Input";
import BrowserDialog from "@UserInterface/Common/Browser/BrowserDialog";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";

export type BadgeBrowserDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
    data?: {
        activeItem?: BadgeData;
        onSelect?: (item: BadgeData) => void;
    }
}

export default function BadgeBrowserDialog({ data, hidden, onClose }: BadgeBrowserDialogProps) {
    const dialogs = useDialogs();
    const hasEditPermissions = usePermissionAction("badges:edit");
    
    const [items, setItems] = useState<BadgeData[]>([]);
    const [activeItem, setActiveItem] = useState<BadgeData | null>(data?.activeItem ?? null);
    
    const [state, setState] = useState(performance.now());
    
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    
    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchImage, setSearchImage] = useState("");

    useEffect(() => {
        setPage(0);
    }, [searchId, searchName, searchImage, searchId]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(BadgeBrowserData, {
            async handle(payload: BadgeBrowserData) {
                setItems(payload.badges);
                setCount(payload.count);
            },
        });

        webSocketClient.sendProtobuff(GetBadgeBrowserData, GetBadgeBrowserData.create({
            offset: page * 50,

            searchId,
            searchName,
            searchImage
        }));

        return () => {
            webSocketClient.removeProtobuffListener(BadgeBrowserData, listener);
        };
    }, [ page, state, searchId, searchName, searchImage ]);

    return (
        <BrowserDialog
            activeId={activeItem?.id ?? null}

            count={count}
            page={page}

            table={{
                flex: [1, 1, 1, 1, 1],
                columns: ["Badge", "ID", "Image", "Name", "Description"],
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
                                    <div style={{ width: 50, height: 50, overflow: "hidden" }}>
                                        <BadgeImage badge={item}/>
                                    </div>
                                </div>
                            ),
                            item.id,
                            item.image ?? null,
                            item.name ?? null,
                            item.description ?? null
                        ],
                        tools: (hasEditPermissions) && (
                            <Fragment>
                                <div className="sprite_room_user_motto_pen" style={{
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-badge", { ...item, onClose: setState(performance.now()) })}/>
                                
                                <div className="sprite_add" style={{
                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-badge", { ...item, id: undefined, onClose: setState(performance.now()) })}/>
                            </Fragment>
                        ),
                        onClick: () => setActiveItem(item)
                    };
                }),
                tools: (hasEditPermissions) && (
                    <div className="sprite_add" style={{
                        cursor: "pointer"
                    }} onClick={() => dialogs.addUniqueDialog("edit-badge", { onClose: setState(performance.now()) })}/>
                )
            }}

            onSelect={(data?.onSelect) && ((id) => data?.onSelect?.(items.find((item) => item.id === id)!))}
            onPageChange={setPage}

            hidden={hidden}
            onClose={onClose}>
            <Input style={{ width: "100%" }} placeholder="ID" value={searchId} onChange={setSearchId}/>
            <Input style={{ width: "100%" }} placeholder="Image" value={searchImage} onChange={setSearchImage}/>
            <Input style={{ width: "100%" }} placeholder="Name" value={searchName} onChange={setSearchName}/>
        </BrowserDialog>
    );
}
