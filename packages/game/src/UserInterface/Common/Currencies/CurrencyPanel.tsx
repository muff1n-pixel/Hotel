import { Fragment } from "react/jsx-runtime";

export type CurrencyPanelProps = {
    credits?: number;
    duckets?: number;
    diamonds?: number;
}

export default function CurrencyPanel({ credits, diamonds, duckets }: CurrencyPanelProps) {
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
            {(Boolean(credits)) && (
                <Fragment>
                    <b>{credits}</b>

                    <div className="sprite_currencies_credits"/>
                </Fragment>
            )}

            {((Boolean(credits) && Boolean(duckets)) || (Boolean(credits) && Boolean(diamonds))) && (
                <div>
                    +
                </div>
            )}

            {(Boolean(duckets)) && (
                <Fragment>
                    <b>{duckets}</b>

                    <div className="sprite_currencies_duckets"/>
                </Fragment>
            )}

            {(Boolean(duckets) && Boolean(diamonds)) && (
                <div>
                    +
                </div>
            )}

            {(Boolean(diamonds)) && (
                <Fragment>
                    <b>{diamonds}</b>

                    <div className="sprite_currencies_diamonds"/>
                </Fragment>
            )}
        </div>
    )
}