import type { Meta, StoryObj } from "@storybook/react-vite";
import Dialog, { DialogProps } from "./Dialog";
import DialogContent from "./Components/DialogContent";

export default {
    component: Dialog
} satisfies Meta;

export const Default = {
    args: {
        title: "My title",

        width: 300,
        height: 140,

        initialPosition: "center",

        onClose: () => alert("Close"),

        children: (
            <DialogContent>
                My content
            </DialogContent>
        )
    } satisfies DialogProps,
} satisfies StoryObj;


export const WithEditMode = {
    args: {
        title: "My title",

        width: 300,
        height: 140,

        initialPosition: "center",

        onEditClick: () => alert("Edit"),
        onClose: () => alert("Close"),

        children: (
            <DialogContent>
                My content
            </DialogContent>
        )
    } satisfies DialogProps,
} satisfies StoryObj;
