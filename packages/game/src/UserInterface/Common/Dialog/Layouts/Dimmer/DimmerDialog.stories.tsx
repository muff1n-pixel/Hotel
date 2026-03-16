import type { Meta, StoryObj } from "@storybook/react-vite";
import DimmerDialog, { DimmerDialogProps } from "./DimmerDialog";

export default {
    component: DimmerDialog
} satisfies Meta;

export const Default = {
    args: {
        title: "My title",
        initialPosition: "center"
    } satisfies DimmerDialogProps,
} satisfies StoryObj;
