import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogTable, { DialogTableProps } from "./DialogTable";

export default {
    component: DialogTable,
    parameters: {
        layout: "centered"
    },
    render: (props) => (
        <div style={{
            width: 400,
            height: 300,

            display: "flex",
            flexDirection: "column"
        }}>
            <DialogTable {...props as DialogTableProps}/>
        </div>
    )
} satisfies Meta;

export const Default = {
    args: {
        columns: ["Column A", "Column B", "Column C"],
        items: Array(100).fill(null).map((_, index) => ({
            id: index,
            values: [ "Value 1", "Value 2", "Value 3" ]
        }))
    } satisfies DialogTableProps,
} satisfies StoryObj;

