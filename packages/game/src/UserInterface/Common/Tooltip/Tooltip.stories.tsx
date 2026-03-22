import { Fragment } from "react/jsx-runtime";
import Tooltip from "./Tooltip";
import type { Meta, StoryObj } from "@storybook/react-vite";

export default {
    component: Tooltip,
    render: ({label, ...args}) => (
        <Fragment>
            <Tooltip {...args}/>

            <div data-tooltip={label}>My element</div>
        </Fragment>
    )
} satisfies Meta;

export const Default = {
    args: {
        label: "Tooltip",
    },
} satisfies StoryObj;
