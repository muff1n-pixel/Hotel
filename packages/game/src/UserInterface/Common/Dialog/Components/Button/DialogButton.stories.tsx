import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogButton, { DialogButtonProps } from "./DialogButton";

export default {
    component: DialogButton,
    parameters: {
        layout: "centered"
    }
} satisfies Meta;

export const Default = {
    args: {
        children: "Button"
    } satisfies DialogButtonProps,
} satisfies StoryObj;

