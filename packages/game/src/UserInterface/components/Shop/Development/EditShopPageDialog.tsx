import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import DialogButton from "../../Dialog/Button/DialogButton";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import Input from "../../Form/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { UpdateShopPageEventData } from "@Shared/Communications/Requests/Shop/Development/UpdateShopPageEventData";
import { useDialogs } from "../../../hooks/useDialogs";

export type EditShopPageDialogProps = {
    data: ShopPageData & { parent?: ShopPageData } | null;
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopPageDialog({ hidden, data, onClose }: EditShopPageDialogProps) {
    const dialogs = useDialogs();

    const [icon, setIcon] = useState(data?.icon ?? "");
    const [title, setTitle] = useState(data?.title ?? "");
    const [description, setDescription] = useState(data?.description ?? "");
    const [type, setType] = useState(data?.type ?? "default");
    const [header, setHeader] = useState(data?.header ?? "");
    const [teaser, setTeaser] = useState(data?.teaser ?? "");
    const [index, setIndex] = useState(data?.index ?? 0);

    const handleUpdate = useCallback(() => {
        webSocketClient.send<UpdateShopPageEventData>("UpdateShopPageEvent", {
            id: data?.id ?? null,

            parentId: data?.parent?.id ?? null,

            category: "furniture",

            type,

            title,
            description,

            icon,
            header,
            teaser,

            index
        });

        dialogs.closeDialog("edit-shop-page");
    }, [dialogs, data, icon, type, title, description, header, teaser, index]);

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
                    {(data?.parent) && (
                        <p style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 4,
                            alignItems: "center"
                        }}>
                            This page {(data?.id)?("is"):("will be")} a child of {(data.parent.icon) && (<img src={`./assets/shop/icons/${data.parent.icon}`}/>)} <b>{data.parent.title}</b>
                        </p>
                    )}

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

                    <b>Page type</b>
    
                    <Input placeholder="default" value={type} onChange={setType}/>

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
