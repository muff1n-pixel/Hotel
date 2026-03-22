import type { Meta, StoryObj } from "@storybook/react-vite";
import Dialog, { DialogProps } from "../../Dialog";
import DialogTabs, { DialogTabsProps } from "./DialogTabs";

export default {
    component: DialogTabs,
    render: (props) => (
        <Dialog width={400} height={300} initialPosition="center" title="Dialog with tabs">
            <DialogTabs {...props as DialogTabsProps}/>
        </Dialog>
    )
} satisfies Meta;

export const Default = {
    args: {
        header: {
            title: "Default header"
        },
        tabs: [
            {
                icon: "Tab 1",
                element: "Tab 1"
            },
            
            {
                icon: "Tab 2",
                element: "Tab 2",
          
                header: {
                    title: "Tab 2 header"
                },
            }
        ]
    } satisfies DialogTabsProps,
} satisfies StoryObj;

export const WithLargeTabs = {
    args: {
        header: {
            title: "Header"
        },
        withLargeTabs: true,
        tabs: [
            {
                icon: "Tab 1",
                element: "Tab 1"
            },
            
            {
                icon: "Tab 2",
                element: "Tab 2"
            }
        ]
    } satisfies DialogTabsProps,
} satisfies StoryObj;

export const WithoutHeader = {
    args: {
        withoutHeader: true,
        tabs: [
            {
                icon: "Tab 1",
                element: "Tab 1"
            },
            
            {
                icon: "Tab 2",
                element: "Tab 2"
            }
        ]
    } satisfies DialogTabsProps,
} satisfies StoryObj;
