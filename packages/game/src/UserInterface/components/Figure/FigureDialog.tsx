import Dialog from "../Dialog/Dialog";
import DialogContent from "../Dialog/DialogContent";
import FigureImage from "./FigureImage";
import { useUser } from "../../hooks/useUser";
import Input from "../Form/Input";
import { useState } from "react";

export type FigureDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function FigureDialog({ hidden, onClose }: FigureDialogProps) {
    const user = useUser();

    const [action, setAction] = useState("Dance.1");
    const [frame, setFrame] = useState(0);

    return (
        <Dialog title="Figure" hidden={hidden} onClose={onClose} width={380} height={380} initialPosition="center">
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

                <b>Action</b>

                <Input type="text" value={action} onChange={setAction}/>

                <b>Frame</b>

                <Input type="number" value={frame.toString()} onChange={(value) => setFrame(parseInt(value))}/>

            </DialogContent>
        </Dialog>
    );
}
