import Selection, { SelectionProps } from "./Selection";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

export default {
    component: Selection,
    parameters: {
        layout: "centered"
    },
    render: (props) => {
        const [value, setValue] = useState(props.value);

        return (
            <div style={{
                width: 200
            }}>
                <Selection {...props as SelectionProps} value={value} onChange={setValue}/>
            </div>
        );
    }
} satisfies Meta;

export const Default = {
    args: {
        value: 1,
        onChange: () => {},

        items: [
            {
                value: 1,
                label: "Item 1"
            },
            
            {
                value: 2,
                label: "Item 2"
            },
            
            {
                value: 3,
                label: "Item 3"
            }
        ]
    } satisfies SelectionProps,
} satisfies StoryObj;
