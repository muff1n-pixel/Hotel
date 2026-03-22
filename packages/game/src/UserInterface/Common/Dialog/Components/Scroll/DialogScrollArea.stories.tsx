import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogScrollArea, { DialogScrollAreaProps } from "./DialogScrollArea";
import DialogPanel from "../Panels/DialogPanel";

export default {
    component: DialogScrollArea,
    parameters: {
        layout: "centered"
    },
    render: (props: DialogScrollAreaProps) => (
        <DialogPanel style={{
            width: 400,
            height: 300
        }}>
            <DialogScrollArea {...props} style={{
                height: "100%"
            }}>
                {Array(100).fill(null).map((_, index) => (<div>Line {index + 1}</div>))}
            </DialogScrollArea>
        </DialogPanel>
    )
} satisfies Meta;

export const Default = {
    args: {
    } satisfies DialogScrollAreaProps,
} satisfies StoryObj;

