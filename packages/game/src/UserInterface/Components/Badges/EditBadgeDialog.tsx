import { BadgeData, UpdateBadgeData } from "@pixel63/events";
import { useCallback, useState } from "react";
import Dialog from "../../Common/Dialog/Dialog";
import DialogContent from "../../Common/Dialog/Components/DialogContent";
import Input from "../../Common/Form/Components/Input";
import DialogButton from "../../Common/Dialog/Components/Button/DialogButton";
import { webSocketClient } from "../../..";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import { useTranslation } from "react-i18next";

export type EditBadgeDialogProps = {
    hidden?: boolean;
    data?: BadgeData & {
        onClose?: (badge?: BadgeData) => void;
    };
    onClose?: () => void;
}

export default function EditBadgeDialog({ hidden, data, onClose }: EditBadgeDialogProps) {
    const [getTranslation] = useTranslation("badges");
    const [id, setId] = useState<string>(data?.id ?? "");

    const [name, setName] = useState<string>(data?.name ?? "");
    const [description, setDescription] = useState<string>(data?.description ?? "");

    const [image, setImage] = useState<string>(data?.image ?? "");

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateBadgeData, UpdateBadgeData.create({
            id,

            name,
            description,

            image,
        }));

        data?.onClose?.(BadgeData.create({
            id,

            name,
            description,

            image,
        }));

        onClose?.();
    }, [ data, onClose, id, name, description, image ]);

    return (
        <Dialog title={getTranslation("editor.title")} hidden={hidden} onClose={onClose} initialPosition="center" width={520} height={340} style={{
            overflow: "visible"
        }}>
            <DialogContent>
                <div style={{
                    flex: 1,

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
                        <div>
                            <BadgeImage badge={BadgeData.create({
                                id,
                                image,

                                name,
                                description
                            })}/>
                        </div>
                    </div>

                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>{getTranslation("editor.id")}</b>

                        <Input value={id} onChange={setId}/>
                        
                        <b>{getTranslation("editor.image")}</b>

                        <Input placeholder={getTranslation("editor.image_placeholder")} value={image} onChange={setImage}/>

                        <b>{getTranslation("editor.name")}</b>

                        <Input value={name} onChange={setName}/>

                        <b>{getTranslation("editor.description")}</b>

                        <Input value={description} onChange={setDescription}/>

                        <div>
                            <DialogButton onClick={handleApply}>{getTranslation((data?.id)?"editor.update":"editor.create")}</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
