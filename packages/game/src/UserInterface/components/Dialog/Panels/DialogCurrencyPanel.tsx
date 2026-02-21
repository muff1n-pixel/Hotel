import { Fragment } from "react/jsx-runtime";
import DialogPanel from "./DialogPanel";

export type DialogCurrencyPanelProps = {
    credits?: number;
    duckets?: number;
    diamonds?: number;
}

export default function DialogCurrencyPanel({ credits, diamonds, duckets }: DialogCurrencyPanelProps) {
    return (
        <DialogPanel>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,

                fontSize: 14,
                fontFamily: "Ubuntu Bold",

                alignItems: "center",

                padding: 4
            }}>
                {(credits) && (
                    <Fragment>
                        <b>{credits}</b>

                        <div className="sprite_currencies_credits"/>
                    </Fragment>
                )}

                {((credits && duckets) || (credits && diamonds)) && (
                    <div>
                        +
                    </div>
                )}

                {(duckets) && (
                    <Fragment>
                        <b>{duckets}</b>

                        <div className="sprite_currencies_duckets"/>
                    </Fragment>
                )}

                {(duckets && diamonds) && (
                    <div>
                        +
                    </div>
                )}

                {(diamonds) && (
                    <Fragment>
                        <b>{diamonds}</b>

                        <div className="sprite_currencies_diamonds"/>
                    </Fragment>
                )}
            </div>
        </DialogPanel>
    )
}