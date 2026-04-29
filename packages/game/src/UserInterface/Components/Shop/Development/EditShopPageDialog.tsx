import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import { Fragment, useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks/useDialogs";
import Selection from "../../../Common/Form/Components/Selection";
import { ShopPageData, UpdateShopPageData } from "@pixel63/events";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export type EditShopPageDialogProps = {
    data: ShopPageData & { shopPages?: ShopPageData[]; } | null;
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopPageDialog({ hidden, data, onClose }: EditShopPageDialogProps) {
    const room = useRoomInstance();
    const dialogs = useDialogs();

    const [icon, setIcon] = useState(data?.icon ?? "");
    const [title, setTitle] = useState(data?.title ?? "");
    const [description, setDescription] = useState(data?.description ?? "");
    const [type, setType] = useState(data?.type ?? "default");
    const [header, setHeader] = useState(data?.header ?? "");
    const [teaser, setTeaser] = useState(data?.teaser ?? "");
    const [index, setIndex] = useState(data?.index ?? 0);
    const [parentId, setParentId] = useState(data?.parentId);

    const [credits, setCredits] = useState(data?.bundle?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.bundle?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.bundle?.diamonds ?? 0);

    const [roomId, setRoomId] = useState(data?.bundle?.roomId ?? "");
    const [badgeId, setBadgeId] = useState(data?.bundle?.badge?.id ?? "");

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateShopPageData, UpdateShopPageData.create({
            id: data?.id,

            parentId,

            category: data?.category ?? "furniture",

            type,

            title,
            description,

            icon,
            header,
            teaser,

            index,

            bundle: (type === "bundle")?({
                id: data?.bundle?.id,

                credits,
                duckets,
                diamonds,

                roomId,
                badge: (badgeId)?({
                    id: badgeId
                }):(undefined)
            }):(undefined)
        }));

        dialogs.closeDialog("edit-shop-page");
    }, [dialogs, data, icon, parentId, type, title, description, header, teaser, index, credits, duckets, diamonds, roomId, badgeId]);

    return (
        <Dialog title={(data?.id)?("Edit shop page"):("Create shop page")} hidden={hidden} onClose={onClose} width={320} height={680} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: "1 1 0",

                    overflowY: "scroll",

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <b>Page icon</b>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        {(icon) && (
                            <div style={{
                                width: 20,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <img src={`./assets/shop/icons/${icon}`}/>
                            </div>
                        )}

                        <div style={{ flex: 1 }}>
                            <Input placeholder="icon_x.png" value={icon ?? ""} onChange={setIcon}/>
                        </div>
                    </div>

                    <b>Page title</b>
    
                    <Input placeholder="Title..." value={title} onChange={setTitle}/>

                    <b>Page description</b>
    
                    <Input placeholder="Description..." value={description} onChange={setDescription}/>

                    <b>Parent page</b>

                    <Selection value={parentId} items={([{value: null, label: "None"}] as any).concat(...(data?.shopPages?.map((shopPage) => {
                        return {
                            value: shopPage.id,
                            label: (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 5,
                                    alignItems: "center"
                                }}>
                                    {(shopPage.icon) && (<img src={`./assets/shop/icons/${shopPage.icon}`}/>)}
                                    
                                    <b>{shopPage.title}</b>
                                </div>
                            )
                        }
                    }) ?? [])).filter((item: any) => item.value !== data?.id)} onChange={(value: string) => setParentId(value)}/>

                    <b>Page type</b>
    
                    <Input placeholder="default" value={type} onChange={setType}/>

                    {(type === "bundle") && (
                        <Fragment>
                            <b>Bundle price</b>

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10
                            }}>
                                <div style={{
                                    width: 20,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <div className="sprite_currencies_credits"/>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <Input type="number" placeholder="0" value={credits.toString()} onChange={(value) => setCredits(parseInt(value))}/>
                                </div>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10
                            }}>
                                <div style={{
                                    width: 20,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <div className="sprite_currencies_duckets"/>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <Input type="number" placeholder="0" value={duckets.toString()} onChange={(value) => setDuckets(parseInt(value))}/>
                                </div>
                            </div>

                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10
                            }}>
                                <div style={{
                                    width: 20,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <div className="sprite_currencies_diamonds"/>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <Input type="number" placeholder="0" value={diamonds.toString()} onChange={(value) => setDiamonds(parseInt(value))}/>
                                </div>
                            </div>

                            <b>Badge ID</b>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5
                            }}>
                                <Input value={badgeId} onChange={(value) => setBadgeId(value)}/>
                            </div>

                            <b>Room ID</b>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5
                            }}>
                                <Input value={roomId} onChange={(value) => setRoomId(value)}/>

                                <DialogButton disabled={!room || room.information?.type !== "bundle"} onClick={() => room && setRoomId(room.id)}>Use current room</DialogButton>
                            </div>
            
                            <div>The selected room must have 'bundle' set as it's room type.</div>
                        </Fragment>
                    )}
                    
                    <b>Page header</b>

                    {(header) && (
                        <div>
                            <img src={`./assets/shop/headers/${header}`}/>
                        </div>
                    )}
    
                    <Input placeholder="x_header.gif" value={header} onChange={setHeader}/>

                    <b>Page teaser</b>

                    {(teaser) && (
                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <img src={`./assets/shop/teasers/${teaser}`}/>
                        </div>
                    )}
    
                    <Input placeholder="x_teaser.gif" value={teaser} onChange={setTeaser}/>

                    <b>Page index</b>
    
                    <Input type={"number"} placeholder="0" value={index.toString()} onChange={(value) => setIndex(parseInt(value))}/>

                    <div style={{
                        flex: 1
                    }}>

                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <DialogButton onClick={handleUpdate}>
                            {(data?.id)?("Update page"):("Create page")}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
