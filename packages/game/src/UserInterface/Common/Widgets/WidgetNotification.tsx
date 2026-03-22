import { BadgeData } from "@pixel63/events";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import { useEffect, useRef } from "react";

export type WidgetNotificationProps = {
    badge?: BadgeData;
    imageUrl?: string;
    text: string;
    duration: number;
    onFinish?: () => void;
};

export default function WidgetNotification({ badge, imageUrl, text, duration, onFinish }: WidgetNotificationProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!ref.current) {
            return;
        }

        window.requestAnimationFrame(() => {
            if(ref.current) {
                ref.current.style.opacity = "1";
            }
        });

        const timeout = setTimeout(() => {
            if(ref.current) {
                ref.current.style.opacity = "0";
                ref.current.style.transform = "translateY(-100%)";

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
            padding: "8px 16px 8px 8px",
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
            gap: 8,

            opacity: 0,
            transition: "opacity 1s, transform 1.5s"
        }}>
            {(badge) && (
                <div>
                    <BadgeImage badge={badge}/>
                </div>
            )}

            {(imageUrl) && (
                <div style={{
                    minWidth: 50,
                    minHeight: 50,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <img src={imageUrl}/>
                </div>
            )}

            <div style={{
                fontFamily: "Ubuntu Medium",
                textShadow: "0px 0px 1px #FFFFFF"
            }}>
                {text.split('\n').map((text) => (
                    <div>
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
}
