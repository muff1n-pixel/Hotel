import DialogPanel, { DialogPanelProps } from "./DialogPanel";
import { useEffect, useState } from "react";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";

export type DialogCurrencyPanelProps = {
    multiplier?: number;

    credits?: number;
    duckets?: number;
    diamonds?: number;
}

export default function DialogCurrencyPanel({ multiplier, credits, diamonds, duckets }: DialogCurrencyPanelProps) {
    const [color, setColor] = useState<DialogPanelProps["color"]>("silver");

    useEffect(() => {
        if(credits && !diamonds && !duckets) {
            setColor("gold");
        }
        else if(!credits && diamonds && !duckets) {
            setColor("teal");
        }
        else if(!credits && !diamonds && duckets) {
            setColor("blue");
        }
        else {
            setColor("silver");
        }
    }, [credits, diamonds, duckets]);

    if(!credits && !diamonds && !duckets) {
        return null;
    }
    
    return (
        <DialogPanel color={color} style={{
            borderColor: "black"
        }}>
            <CurrencyPanel multiplier={multiplier} credits={credits} duckets={duckets} diamonds={diamonds}/>
        </DialogPanel>
    )
}