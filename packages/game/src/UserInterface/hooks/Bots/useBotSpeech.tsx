import { useEffect, useState } from "react";
import { webSocketClient } from "../../..";
import { GetRoomBotSpeechEventData } from "@Shared/Communications/Requests/Rooms/Bots/GetRoomBotSpeechEventData";
import { BotSpeechData, UserBotSpeechData } from "@pixel63/events";

export function useBotSpeech(userBotId: string) {
    const [value, setValue] = useState<BotSpeechData | null>(null);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserBotSpeechData, {
            async handle(payload: UserBotSpeechData) {
                if(payload.botId === userBotId && payload.speech) {
                    setValue(payload.speech);
                }
            },
        });

        webSocketClient.send<GetRoomBotSpeechEventData>("GetRoomBotSpeechEvent", {
            userBotId
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserBotSpeechData, listener);
        };
    }, [userBotId]);

    return value;
}
