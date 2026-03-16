import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogCurrencyPanel, { DialogCurrencyPanelProps } from "./DialogCurrencyPanel";

export default {
    component: DialogCurrencyPanel,
    parameters: {
        layout: "centered"
    }
} satisfies Meta;

export const Default = {
    args: {
        credits: 5,
        duckets: 2
    } satisfies DialogCurrencyPanelProps,
} satisfies StoryObj;
