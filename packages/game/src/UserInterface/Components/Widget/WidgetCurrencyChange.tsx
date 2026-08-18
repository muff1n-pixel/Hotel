import { CSSProperties, PropsWithChildren, TransitionEvent, useCallback, useEffect, useRef, useState } from "react";
import { WidgetCurrencyChangeData } from "./Widget";

function getCurrencyAsString(value?: number) {
    if (!value) {
        return "0";
    }

    const numberFormat = new Intl.NumberFormat('en-US');

    if (value >= 100_000_000) {
        return `${numberFormat.format(Math.round(value / 1_000_000))} M`;
    }

    if (value >= 10_000_000) {
        return `${numberFormat.format(Math.round(value / 1_000_000 * 10) / 10)} M`;
    }

    if (value >= 1_000_000) {
        return `${numberFormat.format(Math.round(value / 1_000_000 * 100) / 100)} M`;
    }

    return numberFormat.format(value);
}

export type WidgetCurrencyChangeProps = PropsWithChildren & {
    data: WidgetCurrencyChangeData;
    tooltip?: string;
    color: string;
    style?: CSSProperties;
    onFinish: () => void;
}

export default function WidgetCurrencyChange({ data, style, tooltip, color, children, onFinish }: WidgetCurrencyChangeProps) {
    const [phase, setPhase] = useState<"enter" | "exit">("enter");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPhase("exit");
        }, 500);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    const handleTransitionEnd = useCallback((event: TransitionEvent) => {
        if (event.propertyName === "transform" && phase === "exit") {
            onFinish();
        }
    }, [phase, onFinish]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                fontSize: 12,
                color,
                alignItems: "center",
                justifyContent: "flex-end",
                position: "absolute",
                right: 80,

                opacity: (phase === "enter")?(1):(0),
                transform: (phase === "enter")?("translateY(0)"):("translateY(-100%)"),

                transition: "opacity 500ms, transform 500ms",

                ...style,
            }}
            onTransitionEnd={handleTransitionEnd}
            data-tooltip={tooltip}
        >
            <b>{data.value > 0 ? "+" : "-"}</b>
            
            <b>{getCurrencyAsString(Math.abs(data.value))}</b>

            {children}
        </div>
    );
}