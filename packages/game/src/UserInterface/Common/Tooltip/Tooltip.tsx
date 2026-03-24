import { MousePosition } from "@Client/Interfaces/MousePosition";
import { useEffect, useRef, useState } from "react";

export type TooltipProps = {
    hideTooltips?: boolean;
}

export default function Tooltip({ hideTooltips }: TooltipProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [label, setLabel] = useState<string>();

    useEffect(() => {
        let listener;

        if(!label) {
            listener = (event: MouseEvent) => {
                const closestTooltip = (event.target as HTMLElement).closest("[data-tooltip]");

                if(closestTooltip) {
                    const label = closestTooltip.getAttribute("data-tooltip");

                    if(label) {
                        setLabel(label);
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

            const boundingClientRectangle = ref.current.getBoundingClientRect();

            const maxLeft = window.innerWidth - boundingClientRectangle.width;
            const maxTop = window.innerHeight - boundingClientRectangle.height;

            ref.current.style.left = `${Math.min(event.clientX + 16, maxLeft)}px`;
            ref.current.style.top = `${Math.min(event.clientY + 16, maxTop)}px`;

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

            zIndex: 1000000000,

            // Put it outside of the screen until the effect can render the correct position
            left: "100%",
            top: "100%",

            padding: 6,

            background: "rgba(0, 0, 0, .7)",
            borderRadius: 6,

            textWrap: "nowrap",

            fontSize: 12,

            color: "#FFFFFF",

            pointerEvents: "none"
        }}>
            {label}
        </div>
    );
}
