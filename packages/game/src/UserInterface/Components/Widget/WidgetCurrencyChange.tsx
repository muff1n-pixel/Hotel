import { CSSProperties, PropsWithChildren, useEffect, useRef, useState } from "react";
import { WidgetCurrencyChangeData } from "./Widget";

function getCurrencyAsString(value?: number) {
    if(!value) {
        return "0";
    }

    const numberFormat = new Intl.NumberFormat('en-US');
    
    if(value >= 100_000_000) {
        return `${numberFormat.format(Math.round(value / 1_000_000))} M`;
    }
    
    if(value >= 10_000_000) {
        return `${numberFormat.format(Math.round(value / 1_000_000 * 10) / 10)} M`;
    }

    if(value >= 1_000_000) {
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
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        elementRef.current.addEventListener("transitionend", () => {
            setTimeout(() => {
                if(!elementRef.current) {
                    return;
                }

                elementRef.current.style.transform = "translateY(-100%)";
                elementRef.current.style.opacity = "0";

                elementRef.current.addEventListener("transitionend", () => {
                    onFinish();
                }, {
                    once: true
                });
            }, 500);
        }, {
            once: true
        });

        elementRef.current.style.opacity = "1";
    }, [elementRef]);

    return (
        <div ref={elementRef} style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            fontSize: 12,
            color,
            alignItems: "center",
            justifyContent: "flex-end",
            position: "absolute",
            right: 70,
            opacity: 0,
            transitionProperty: "opacity, transform",
            transitionDuration: "500ms",
            transitionDelay: "0s",
            ...style
        }} data-tooltip={tooltip}>
            <b>{(data.value > 0)?('+'):('-')}</b>
            
            <b>{getCurrencyAsString(Math.abs(data.value))}</b>

            {children}
        </div>
    );
}
