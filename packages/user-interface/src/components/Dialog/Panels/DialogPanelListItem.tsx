import { Fragment, ReactNode } from "react";
import "./DialogPanelListItem.css";

export type DialogPanelListItemProps = {
    active: boolean;
    icon?: ReactNode;
    title: string;
    subItem?: boolean;
    onClick: () => void;
    children?: ReactNode;
};

export default function DialogPanelListItem({ active, icon, title, onClick, children, subItem }: DialogPanelListItemProps) {
    return (
        <Fragment>
            <div className={`dialog-panel-list-item ${(active)?("active"):("")} ${(subItem)?("subitem"):("")}`} onClick={onClick}>
                <div className="dialog-panel-list-item-content" style={{
                    height: 16,
                    padding: "0 2px",
                    cursor: "pointer",

                    paddingLeft: (subItem)?(16):(2),

                    display: "flex",
                    alignItems: "center",
                    gap: 6
                }}>
                    {(icon) && (
                        <div style={{
                            display: "flex",
                            
                            justifyContent: "center",
                            alignItems: "center",

                            height: 18,
                            width: 18
                        }}>
                            {icon}
                        </div>
                    )}

                    {title}
                </div>
            </div>

            {children}
        </Fragment>
    )
}
