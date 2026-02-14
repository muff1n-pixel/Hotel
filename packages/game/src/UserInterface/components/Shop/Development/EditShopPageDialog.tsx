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
    data: ShopPageData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopPageDialog({ hidden, data, onClose }: EditShopPageDialogProps) {
    const dialogs = useDialogs();

    const [icon, setIcon] = useState(data.icon ?? "");
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description ?? "");
    const [header, setHeader] = useState(data.header ?? "");
    const [teaser, setTeaser] = useState(data.teaser ?? "");

    const handleUpdate = useCallback(() => {
        webSocketClient.send<UpdateShopPageEventData>("UpdateShopPageEvent", {
            id: data.id,

            title,
            description,

            icon,
            header,
            teaser
        });

        dialogs.closeDialog("edit-shop-page");
    }, [dialogs, icon, title, description, header, teaser]);

    return (
        <Dialog title="Edit shop page" hidden={hidden} onClose={onClose} width={320} height={590} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

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

                    <div style={{
                        flex: 1
                    }}>

                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <DialogButton onClick={handleUpdate}>
                            Update page
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
