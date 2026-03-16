import { MousePosition } from "@Client/Interfaces/MousePosition";
import { useEffect, useRef, useState } from "react";

export type TooltipProps = {
    hideTooltips?: boolean;
}

export default function Tooltip({ hideTooltips }: TooltipProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [label, setLabel] = useState<string>();

    const [initialPosition, setInitialPosition] = useState<MousePosition>();

    useEffect(() => {
        let listener;

        if(!label) {
            listener = (event: MouseEvent) => {
                const closestTooltip = (event.target as HTMLElement).closest("[data-tooltip]");

                if(closestTooltip) {
                    const label = closestTooltip.getAttribute("data-tooltip");

                    if(label) {
                        setLabel(label);

                        setInitialPosition({
                            left: event.clientX,
                            top: event.clientY
                        });
                    }
                }
            };
        }
        else {
            listener = (event: MouseEvent) => {
                const closestTooltip = (event.target as HTMLElement).closest("[data-tooltip]");

                if(!closestTooltip) {
                    setLabel(undefined);
                }
            };
        }

        document.addEventListener("mouseover", listener);

        return () => {
            document.removeEventListener("mouseover", listener);
        };
    }, [label]);

    useEffect(() => {
        if(!ref.current) {
            return;
        }

        if(!label) {
            return;
        }

        const listener = (event: MouseEvent) => {
            if(!ref.current) {
                return;
            }

            ref.current.style.left = `${event.clientX}px`;
            ref.current.style.top = `${event.clientY}px`;

            ref.current.style.display = "block";
        };

        document.body.addEventListener("mousemove", listener);

        return () => {
            document.body.removeEventListener("mousemove", listener);
        };
    }, [label, ref]);

    if(hideTooltips) {
        return null;
    }

    if(!label) {
        return null;
    }

    return (
        <div ref={ref} style={{
            position: "fixed",

            zIndex: 1,

            left: initialPosition?.left,
            top: initialPosition?.top,

            padding: 6,

            background: "rgba(0, 0, 0, .7)",
            borderRadius: 6,

            transform: "translate(16px, 16px)",

            textWrap: "nowrap",

            fontSize: 12,

            color: "#FFFFFF",

            pointerEvents: "none"
        }}>
            {label}
        </div>
    );
}
