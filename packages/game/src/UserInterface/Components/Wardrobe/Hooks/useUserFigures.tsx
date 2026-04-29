import { GetUserFiguresData, UserFigureData, UserFiguresData } from "@pixel63/events";
import { useEffect, useRef, useState } from "react";
import { webSocketClient } from "@Game/index";

export default function useUserFigures() {
    const requested = useRef<boolean>(false);

    const [figures, setFigures] = useState<(UserFigureData | null)[]>(Array(10).fill(null));

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserFiguresData, {
            async handle(payload: UserFiguresData) {
                setFigures(
                    Array(10).fill(null).map((_, index) => payload.figures.find((figure) => figure.index === index) ?? null)
                );
            },
        });

        if(!requested.current) {
            requested.current = true;

            webSocketClient.sendProtobuff(GetUserFiguresData, GetUserFiguresData.create({}));
        }

        return () => {
            webSocketClient.removeProtobuffListener(UserFiguresData, listener);
        };
    }, []);

    return figures;
}