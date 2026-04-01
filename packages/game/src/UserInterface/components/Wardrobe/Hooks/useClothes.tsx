import { GetUserClothesData, RefreshUserClothesData, UserClothesData, UserClothingUnlockedData } from "@pixel63/events";
import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "src";

export default function useClothes(part: string) {
    const partRequested = useRef<string>(null);

    const [data, setData] = useState<UserClothesData>();

    useEffect(() => {
        if(partRequested.current === part) {
            return;
        }

        partRequested.current = part;

        webSocketClient.sendProtobuff(GetUserClothesData, GetUserClothesData.create({
            part
        }));
    }, [part]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserClothesData, {
            async handle(payload: UserClothesData) {
                if(payload.part !== part) {
                    return;
                }

                setData(payload);
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserClothesData, listener);
        };
    }, [part]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserClothingUnlockedData, {
            async handle() {
                webSocketClient.sendProtobuff(GetUserClothesData, GetUserClothesData.create({
                    part
                }));
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserClothingUnlockedData, listener);
        };
    }, [part]);

    return data;
}