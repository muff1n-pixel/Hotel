import Checkbox, { CheckboxProps } from "./Checkbox";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

export default {
    component: Checkbox,
    parameters: {
        layout: "centered"
    },
    render: (props) => {
        const [value, setValue] = useState(props.value);

        return (
            <Checkbox label={props.label} value={value} onChange={setValue}/>
        );
    }
} satisfies Meta;

export const Default = {
    args: {
        label: "Checkbox",
        value: false,
        onChange: () => {}
    } satisfies CheckboxProps,
} satisfies StoryObj;
