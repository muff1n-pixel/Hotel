import { GetUserEffectsData, UserClothingUnlockedData, UserEffectsData } from "@pixel63/events";
import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "@Game/index";

export default function useEffects() {
    const requested = useRef<boolean>(null);

    const [data, setData] = useState<UserEffectsData>();

    useEffect(() => {
        if(requested.current) {
            return;
        }

        requested.current = true;

        webSocketClient.sendProtobuff(GetUserEffectsData, GetUserEffectsData.create({}));
    }, []);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserEffectsData, {
            async handle(payload: UserEffectsData) {
                setData(payload);
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserEffectsData, listener);
        };
    }, []);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserClothingUnlockedData, {
            async handle() {
                webSocketClient.sendProtobuff(GetUserEffectsData, GetUserEffectsData.create({}));
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserClothingUnlockedData, listener);
        };
    }, []);

    return data?.effects ?? [];
}