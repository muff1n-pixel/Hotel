import { BadgeData } from "@pixel63/events";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import { useEffect, useRef } from "react";

export type WidgetNotificationProps = {
    badge?: BadgeData;
    text: string;
    duration: number;
    onFinish?: () => void;
};

export default function WidgetNotification({ badge, text, duration, onFinish }: WidgetNotificationProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!ref.current) {
            return;
        }

        const timeout = setTimeout(() => {
            if(ref.current) {
                ref.current.style.opacity = "0";

                setTimeout(() => {
                    onFinish?.();
                }, 1000);
            }
        }, duration);

        return () => {
            clearTimeout(timeout);
        };
    }, [ref]);

    return (
        <div ref={ref} style={{
            padding: 16,
            borderRadius: 6,

            background: "rgba(61, 61, 61, .95)",
            pointerEvents: "auto",

            width: 190,

            fontSize: 12,
            color: "white",

            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,

            transition: "opacity 1s"
        }}>
            {(badge) && (
                <div style={{
                }}>
                    <BadgeImage badge={badge}/>
                </div>
            )}

            <div style={{
                alignSelf: "flex-start",

                fontFamily: "Ubuntu Medium",
                textShadow: "0px 0px 1px #FFFFFF"
            }}>
                {text}
            </div>
        </div>
    );
}
