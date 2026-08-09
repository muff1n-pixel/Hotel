import { PropsWithChildren, useState } from "react";

export type DialogListContainerProps = PropsWithChildren & {
    title: string;
    cards: boolean;
    onCardsToggle: (cards: boolean) => void;
}

export default function DialogListContainer({ title, children, cards, onCardsToggle }: DialogListContainerProps) {
    const [folded, setFolded] = useState(false);

    return (
        <div style={{
            padding: 4,
            background: "#FFFFFF"
        }}>
            <div style={{
                height: 25,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                color: "#14597E",
            }}>
                <div style={{
                    width: 24,
                    height: 24,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    cursor: "pointer"
                }} onClick={() => setFolded(!folded)}>
                    <div className={(folded)?("sprite_dialog_list-unfold"):("sprite_dialog_list-fold")}/>
                </div>
                
                <div style={{ flex: 1 }}>
                    {title}
                </div>

                <div style={{
                    width: 24,
                    height: 24,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    cursor: "pointer"
                }} onClick={() => onCardsToggle(!cards)}>
                    <div className={(!cards)?("sprite_dialog_cards"):("sprite_dialog_list")}/>
                </div>
            </div>

            {!folded && children}
        </div>
    );
}