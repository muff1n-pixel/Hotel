import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import "./ToolbarTab.css";

export type ToolbarTabProps = {
    items: {
        tooltip?: string;
        spriteClass: string;
        onClick?: () => void;
    }[];
}

export default function ToolbarTab({ items }: ToolbarTabProps) {
    return (
        <FlexLayout className="toolbar-tab" align="center">
            {items.map((item) => (
                <div key={item.spriteClass} className={`toolbar-tab-sprite ${item.spriteClass}`} data-tooltip={item.tooltip} onClick={item.onClick}>

                </div>
            ))}
        </FlexLayout>
    );
}