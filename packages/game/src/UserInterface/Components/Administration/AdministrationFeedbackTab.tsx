import { useEffect, useState } from "react";
import { GetHotelFeedbackData, HotelFeedbackData } from "@pixel63/events";
import { HotelFeedbackCollectionData } from "@pixel63/events/build/Hotel/Feedback/HotelFeedbackData";
import { webSocketClient } from "@Game/index";

export default function AdministrationFeedbackTab() {
    const [issues, setIssues] = useState<HotelFeedbackData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(HotelFeedbackCollectionData, {
            async handle(payload: HotelFeedbackCollectionData) {
                setIssues(payload.feedback);
            },
        });

        webSocketClient.sendProtobuff(GetHotelFeedbackData, GetHotelFeedbackData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(HotelFeedbackCollectionData, listener);
        };
    }, []);

    return (
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
    );
}
