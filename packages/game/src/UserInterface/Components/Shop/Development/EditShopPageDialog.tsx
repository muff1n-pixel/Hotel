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
import { useTranslation } from "react-i18next";

export type EditShopPageDialogProps = {
    data: ShopPageData & { shopPages?: ShopPageData[]; } | null;
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopPageDialog({ hidden, data, onClose }: EditShopPageDialogProps) {
    const room = useRoomInstance();
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");

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
        <Dialog title={(data?.id)?(getTranslation("edit.page.edit")):(getTranslation("edit.page.create"))} editMode hidden={hidden} onClose={onClose} width={320} height={680} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: "1 1 0",

                    overflowY: "scroll",

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <b>{getTranslation("edit.page.icon")}</b>

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

                    <b>{getTranslation("edit.page.title")}</b>
    
                    <Input placeholder={getTranslation("edit.page.title_placeholder")} value={title} onChange={setTitle}/>

                    <b>{getTranslation("edit.page.description")}</b>
    
                    <Input placeholder={getTranslation("edit.page.description_placeholder")} value={description} onChange={setDescription}/>

                    <b>{getTranslation("edit.page.parent")}</b>

                    <Selection value={parentId} items={([{value: null, label: getTranslation("edit.none")}] as any).concat(...(data?.shopPages?.map((shopPage) => {
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

                    <b>{getTranslation("edit.page.type")}</b>
    
                    <Input placeholder="default" value={type} onChange={setType}/>

                    {(type === "bundle") && (
                        <Fragment>
                            <b>{getTranslation("edit.page.bundle_price")}</b>

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

                            <b>{getTranslation("edit.page.badge_id")}</b>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5
                            }}>
                                <Input value={badgeId} onChange={(value) => setBadgeId(value)}/>
                            </div>

                            <b>{getTranslation("edit.page.room_id")}</b>

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5
                            }}>
                                <Input value={roomId} onChange={(value) => setRoomId(value)}/>

                                <DialogButton disabled={!room || room.information?.type !== "bundle"} onClick={() => room && setRoomId(room.id)}>{getTranslation("edit.page.use_current_room")}</DialogButton>
                            </div>
            
                            <div>{getTranslation("edit.page.bundle_room_requirement")}</div>
                        </Fragment>
                    )}
                    
                    <b>{getTranslation("edit.page.header")}</b>

                    {(header) && (
                        <div>
                            <img src={`./assets/shop/headers/${header}`}/>
                        </div>
                    )}
    
                    <Input placeholder="x_header.gif" value={header} onChange={setHeader}/>

                    <b>{getTranslation("edit.page.teaser")}</b>

                    {(teaser) && (
                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <img src={`./assets/shop/teasers/${teaser}`}/>
                        </div>
                    )}
    
                    <Input placeholder="x_teaser.gif" value={teaser} onChange={setTeaser}/>

                    <b>{getTranslation("edit.page.index")}</b>
    
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
                            {(data?.id)?(getTranslation("edit.update")):(getTranslation("edit.create"))}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
