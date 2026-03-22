import Input, { InputProps } from "./Input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

export default {
    component: Input,
    parameters: {
        layout: "centered"
    },
    render: (props) => {
        const [value, setValue] = useState(props.value);

        return (
            <div style={{
                width: 200
            }}>
                <Input {...props} value={value} onChange={setValue}/>
            </div>
        );
    }
} satisfies Meta;

export const Default = {
    args: {
        placeholder: "Type...",
        value: "",
        onChange: () => {}
    } satisfies InputProps,
} satisfies StoryObj;
