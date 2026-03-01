import { useEffect, useState } from "react";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import { webSocketClient } from "../../../..";
import { HotelFeedbackData } from "@pixel63/events";
import { HotelFeedbackCollectionData } from "@pixel63/events/build/Hotel/Feedback/HotelFeedbackData";

export type ViewIssuesDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function ViewIssuesDialog({ hidden, onClose }: ViewIssuesDialogProps) {
    const [issues, setIssues] = useState<HotelFeedbackData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(HotelFeedbackCollectionData, {
            async handle(payload: HotelFeedbackCollectionData) {
                setIssues(payload.feedback);
            },
        });

        webSocketClient.send("GetHotelFeedbackEvent", null);

        return () => {
            webSocketClient.removeProtobuffListener(HotelFeedbackCollectionData, listener);
        };
    }, []);

    return (
        <Dialog title="Feedback reports" hidden={hidden} onClose={onClose} width={320} height={390} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <div style={{
                        flex: "1 1 0",

                        overflowY: "scroll",

                        display: "flex",
                        flexDirection: "column",
                        gap: 20
                    }}>
                        {issues?.map((issue) => (
                            <div key={issue.id} style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 5
                            }}>
                                {(issue.area) && (
                                    <div>
                                        <div><b>Area:</b></div>

                                        <p>{issue.area}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <div><b>Description:</b></div>

                                    <p>{issue.description}</p>
                                </div>

                                <div>
                                    <b>Reported by {issue.user?.name}</b>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
