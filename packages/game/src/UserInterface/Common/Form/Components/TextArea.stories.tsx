import TextArea, { TextAreaProps } from "./TextArea";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

export default {
    component: TextArea,
    parameters: {
        layout: "centered"
    },
    render: (props) => {
        const [value, setValue] = useState(props.value);

        return (
            <div style={{
                width: 200
            }}>
                <TextArea {...props} value={value} onChange={setValue}/>
            </div>
        );
    }
} satisfies Meta;

export const Default = {
    args: {
        placeholder: "Type...",
        value: "",
        onChange: () => {}
    } satisfies TextAreaProps,
} satisfies StoryObj;
