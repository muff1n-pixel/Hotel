import type { Meta, StoryObj } from "@storybook/react-vite";
import DimmerDialogButton, { DimmerDialogButtonProps } from "@UserInterface/Common/Dialog/Layouts/Dimmer/Components/DimmerDialogButton";

export default {
    component: DimmerDialogButton,
    parameters: {
        layout: "centered"
    }
} satisfies Meta;

export const Default = {
    args: {
        label: "My button",
        onClick: () => {}
    } satisfies DimmerDialogButtonProps,
} satisfies StoryObj;
