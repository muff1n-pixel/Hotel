import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogItem, { DialogItemProps } from "./DialogItem";

export default {
    component: DialogItem,
    parameters: {
        layout: "centered"
    }
} satisfies Meta;

export const Default = {
    args: {
        width: 50,

        children: (
            <div className="sprite_toolbar_logo"/>
        )
    } satisfies DialogItemProps,
} satisfies StoryObj;

