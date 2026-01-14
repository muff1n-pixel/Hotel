import { act, ReactNode, useState } from "react";
import DialogContent from "../DialogContent";

export type DialogSubTabsProps = {
    tabs: {
        icon: ReactNode;
        activeIcon?: ReactNode;
        
        element: ReactNode;
    }[];
};

export default function DialogSubTabs({ tabs }: DialogSubTabsProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row"
            }}>
                {tabs.map(({ icon, activeIcon }, index) => (
                    <div key={index} style={{
                        display: "flex",

                        width: 52,
                        height: 50,

                        overflow: "hidden",

                        justifyContent: "center",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => setActiveIndex(index)}>
                        {(activeIndex === index)?(activeIcon ?? icon):(icon)}
                    </div>
                ))}
            </div>

            <div key={activeIndex}>
                {tabs[activeIndex].element}
            </div>
        </div>
    );
}
