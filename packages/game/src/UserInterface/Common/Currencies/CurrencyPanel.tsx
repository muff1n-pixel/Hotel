import { Fragment } from "react/jsx-runtime";

export type CurrencyPanelProps = {
    credits?: number;
    duckets?: number;
    diamonds?: number;

    multiplier?: number;
}

export default function CurrencyPanel({ multiplier, credits, diamonds, duckets }: CurrencyPanelProps) {
    if(!credits && !diamonds && !duckets) {
        return null;
    }
    
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,

            fontSize: 14,
            fontFamily: "Ubuntu Bold",

            alignItems: "center",

            padding: 4
        }}>
            {(credits !== undefined) && (
                <Fragment>
                    <b>{(multiplier ?? 1) * credits}</b>

                    <div className="sprite_currencies_credits"/>
                </Fragment>
            )}

            {((Boolean(credits) && Boolean(duckets)) || (Boolean(credits) && Boolean(diamonds))) && (
                <div>
                    +
                </div>
            )}

            {(duckets !== undefined) && (
                <Fragment>
                    <b>{(multiplier ?? 1) * duckets}</b>

                    <div className="sprite_currencies_duckets"/>
                </Fragment>
            )}

            {(Boolean(duckets) && Boolean(diamonds)) && (
                <div>
                    +
                </div>
            )}

            {(diamonds !== undefined) && (
                <Fragment>
                    <b>{(multiplier ?? 1) * diamonds}</b>

                    <div className="sprite_currencies_diamonds"/>
                </Fragment>
            )}
        </div>
    )
}