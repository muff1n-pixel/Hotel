import { ReactNode, useState } from "react";

export type DialogTableProps = {
    columns: string[];
    items?: {
        id: string;
        values: ReactNode[];
        onClick?: () => void;
    }[];
};

export default function DialogTable({ columns, items }: DialogTableProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

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
                {columns.map((column) => (
                    <div key={column} style={{
                        flex: 1
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
                        cursor: "pointer",
                        background: (activeId === item.id)?("#B8E2FC"):("transparent")
                    }} onClick={() => {
                        setActiveId(item.id);
                        item.onClick?.();
                    }}>
                        {item.values.map((value) => (
                            <div key={value?.toString()} style={{
                                flex: 1
                            }}>
                                <div style={{
                                    color: "#000",
                                    fontSize: 12
                                }}>
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
