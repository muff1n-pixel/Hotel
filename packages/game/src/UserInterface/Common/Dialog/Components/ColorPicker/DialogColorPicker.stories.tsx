import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogColorPicker, { DialogColorPickerProps } from "./DialogColorPicker";
import { useState } from "react";

export default {
    component: DialogColorPicker,
    parameters: {
        layout: "centered"
    },
    render: (props) => {
        const [value, setValue] = useState(props.value);

        return (
            <div style={{
                width: 300
            }}>
                <DialogColorPicker value={value} onChange={setValue}/>
            </div>
        );
    }
} satisfies Meta;

export const Default = {
    args: {
        value: "#FF0000",
        onChange: () => {}
    } satisfies DialogColorPickerProps,
} satisfies StoryObj;

