import type { Meta, StoryObj } from "@storybook/react-vite";
import DimmerDialogCheckbox, { DimmerDialogCheckboxProps } from "@UserInterface/Common/Dialog/Layouts/Dimmer/Components/DimmerDialogCheckbox";
import { useState } from "react";

export default {
    component: DimmerDialogCheckbox,
    parameters: {
        layout: "centered"
    },
    render: (props) => {
        const [value, setValue] = useState(props.value);

        return (
            <DimmerDialogCheckbox {...props as DimmerDialogCheckboxProps} value={value} onChange={setValue}/>
        )
    }
} satisfies Meta;

export const Default = {
    args: {
        label: "Checkbox",
        value: false,
        onChange: () => {}
    } satisfies DimmerDialogCheckboxProps,
} satisfies StoryObj;
