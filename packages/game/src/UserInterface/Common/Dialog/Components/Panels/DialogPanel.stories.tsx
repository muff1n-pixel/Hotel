import type { Meta, StoryObj } from "@storybook/react-vite";
import DialogPanel, { DialogPanelProps } from "./DialogPanel";
import DialogPanelList from "./DialogPanelList";
import DialogPanelListItem from "./DialogPanelListItem";

export default {
    component: DialogPanel,
    parameters: {
        layout: "centered"
    }
} satisfies Meta;

export const Default = {
    args: {
        style: {
            width: 400,
            height: 300
        }
    } satisfies DialogPanelProps,
} satisfies StoryObj;

export const List = {
    args: {
        style: {
            width: 200,
            height: 300
        },
        children: (
            <DialogPanelList>
                <DialogPanelListItem active title="Item 1" onClick={() => {}}>
                    <DialogPanelListItem subItem={1} active={false} title="Item A" onClick={() => {}}/>
                    <DialogPanelListItem subItem={1} active={false} title="Item B" onClick={() => {}}/>
                </DialogPanelListItem>

                <DialogPanelListItem active={false} title="Item 2" onClick={() => {}}/>
                <DialogPanelListItem active={false} title="Item 3" onClick={() => {}}/>
            </DialogPanelList>
        )
    } satisfies DialogPanelProps,
} satisfies StoryObj;

