import { ReactNode, useState } from "react";

export type DialogTableProps = {
    activeId?: any;

    flex?: number[];
    columns: string[];
    items?: {
        id: any;
        values: ReactNode[];
        tools?: ReactNode;
        onClick?: () => void;
    }[];

    tools?: ReactNode;
};

export default function DialogTable({ activeId, flex, columns, items, tools }: DialogTableProps) {
    const [_activeId, setActiveId] = useState<string | null>(null);

    return (
        <div style={{
            flex: 1,

            border: "1px solid #5D5D5A",
            borderRadius: 6,

            background: "#FFF",

            display: "flex",
            flexDirection: "column",

            padding: 4,
            gap: 4
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                padding: 4
            }}>
                {columns.map((column, index) => (
                    <div key={column} style={{
                        flex: flex?.[index] ?? 1
                    }}>
                        <div style={{
                            color: "#000",
                            fontFamily: "Ubuntu Bold",
                            fontSize: 12
                        }}>
                            {column}
                        </div>
                    </div>
                ))}

                {tools}
            </div>

            <div style={{
                background: "#AFAFAF",

                height: 1
            }}/>

            <div style={{
                flex: "1 1 0",
                overflow: "scroll"
            }}>
                {items?.map((item) => (
                    <div key={item.id} style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        padding: 4,
                        background: (item.id === (activeId ?? _activeId))?("#B8E2FC"):("transparent")
                    }}>
                        {item.values.map((value, index) => (
                            <div key={value?.toString()} style={{
                                flex: flex?.[index] ?? 1,
                                cursor: "pointer",
                            }} onClick={() => {
                                setActiveId(item.id);
                                item.onClick?.();
                            }}>
                                <div style={{
                                    color: "#000",
                                    fontSize: 12
                                }}>
                                    {value}
                                </div>
                            </div>
                        ))}

                        {item.tools}
                    </div>
                ))}
            </div>
        </div>
    );
}
