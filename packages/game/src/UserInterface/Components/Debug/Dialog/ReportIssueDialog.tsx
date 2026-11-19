import { useCallback, useState } from "react";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks/useDialogs";
import { SendHotelFeedbackData } from "@pixel63/events";
import { useTranslation } from "react-i18next";

export type ReportIssueDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function ReportIssueDialog({ hidden, onClose }: ReportIssueDialogProps) {
    const { addDialog } = useDialogs();
    const [getTranslation] = useTranslation("debug");

    const [area, setArea] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = useCallback(() => {
        addDialog("alert", {
            message: getTranslation("report_issue.thanks")
        });

        onClose?.();

        webSocketClient.sendProtobuff(SendHotelFeedbackData, SendHotelFeedbackData.create({
            area,
            description
        }));
    }, [area, description, addDialog, onClose]);

    return (
        <Dialog title={getTranslation("report_issue.title")} hidden={hidden} onClose={onClose} width={320} height={390} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <b>{getTranslation("report_issue.area_question")}</b>
                    <div>{getTranslation("report_issue.area_example")}</div>
    
                    <Input placeholder={getTranslation("report_issue.area_placeholder")} value={area} onChange={setArea}/>
                    
                    <b>{getTranslation("report_issue.issue_question")}</b>
                    <div>{getTranslation("report_issue.issue_description")}</div>
    
                    <Input placeholder={getTranslation("report_issue.issue_placeholder")} value={description} onChange={setDescription}/>

                    <div style={{ padding: "12px 0" }}>
                        <p>{getTranslation("report_issue.feedback_suggestions")}</p>
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
                            {getTranslation("report_issue.submit")}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
