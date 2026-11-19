import Dialog from "../../Common/Dialog/Dialog";
import DialogContent from "../../Common/Dialog/Components/DialogContent";
import { useUser } from "../../Hooks/useUser";
import Input from "../../Common/Form/Components/Input";
import { useState } from "react";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import { useTranslation } from "react-i18next";

export type FigureDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function FigureDialog({ hidden, onClose }: FigureDialogProps) {
    const user = useUser();
    const [getTranslation] = useTranslation("figure");

    const [action, setAction] = useState("Dance.1");
    const [frame, setFrame] = useState(0);

    return (
        <Dialog title={getTranslation("dialog.title")} hidden={hidden} onClose={onClose} width={380} height={380} initialPosition="center">
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 120
                }}>
                    {Array(8).fill(null).map((_, index) => (
                        <div style={{
                            flex: 1
                        }}>
                            <FigureImage key={index} frame={frame} figureConfiguration={user.figureConfiguration!} actions={(action.length)?([action]):([])} direction={index} cropped/>
                        </div>
                    ))}
                </div>

                <b>{getTranslation("dialog.action")}</b>

                <Input type="text" value={action} onChange={setAction}/>

                <b>{getTranslation("dialog.frame")}</b>

                <Input type="number" value={frame.toString()} onChange={(value) => setFrame(parseInt(value))}/>

            </DialogContent>
        </Dialog>
    );
}
