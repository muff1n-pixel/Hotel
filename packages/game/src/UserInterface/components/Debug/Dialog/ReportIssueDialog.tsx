import { useCallback, useState } from "react";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import Input from "../../Form/Input";
import DialogButton from "../../Dialog/Button/DialogButton";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../hooks/useDialogs";
import { SendHotelFeedbackData } from "@pixel63/events";

export type ReportIssueDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function ReportIssueDialog({ hidden, onClose }: ReportIssueDialogProps) {
    const { addDialog } = useDialogs();

    const [area, setArea] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = useCallback(() => {
        addDialog("alert", {
            message: "Thank you for your feedback!"
        });

        onClose?.();

        webSocketClient.sendProtobuff(SendHotelFeedbackData, SendHotelFeedbackData.create({
            area,
            description
        }));
    }, [area, description, addDialog, onClose]);

    return (
        <Dialog title="Report an issue" hidden={hidden} onClose={onClose} width={320} height={390} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <b>What area is the issue regarding?</b>
                    <div>E.g. room rendering, furniture rendering, navigator dialog, etc.</div>
    
                    <Input placeholder="Issue area (optional)" value={area} onChange={setArea}/>
                    
                    <b>What is the issue?</b>
                    <div>Write as much or as little as you wish, describing the issue.</div>
    
                    <Input placeholder="Issue description" value={description} onChange={setDescription}/>

                    <div style={{ padding: "12px 0" }}>
                        <p>You can also use this form to suggest improvements, new functionality, or general feedback.</p>
                    </div>

                    <div style={{
                        flex: 1
                    }}>

                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <DialogButton disabled={!description.length} onClick={handleSubmit}>
                            Submit feedback
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
