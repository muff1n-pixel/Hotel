import { ReactNode, useState } from "react";

export type DialogSubTabsProps = {
    activeIndex?: number;
    onTabChange?: (activeIndex: number) => void;

    tabs: {
        icon: ReactNode;
        activeIcon?: ReactNode;
        
        element: ReactNode;
    }[];
};

export default function DialogSubTabs({ activeIndex: forcedActiveIndex, onTabChange, tabs }: DialogSubTabsProps) {
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
                    }} onClick={() => onTabChange?.(index) ?? setActiveIndex(index)}>
                        {((forcedActiveIndex ?? activeIndex) === index)?(activeIcon ?? icon):(icon)}
                    </div>
                ))}
            </div>

            <div key={(forcedActiveIndex ?? activeIndex)}>
                {tabs[forcedActiveIndex ?? activeIndex].element}
            </div>
        </div>
    );
}
