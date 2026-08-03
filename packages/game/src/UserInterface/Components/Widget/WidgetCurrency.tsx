import { CSSProperties, PropsWithChildren } from "react";

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

export type WidgetCurrencyProps = PropsWithChildren & {
    tooltip?: string;
    color: string;
    value: number;
    style?: CSSProperties;
}

export default function WidgetCurrency({ style, tooltip, color, value, children }: WidgetCurrencyProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            fontSize: 12,
            color,
            alignItems: "center",
            position: "relative",
            ...style
        }} data-tooltip={tooltip}>
            <b>{getCurrencyAsString(value)}</b>

            {children}
        </div>
    );
}
