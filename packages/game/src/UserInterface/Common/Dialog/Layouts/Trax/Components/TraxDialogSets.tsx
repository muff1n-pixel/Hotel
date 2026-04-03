import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { ReactNode } from "react";

export type TraxDialogSetsProps = {
    children?: ReactNode;
}

export default function TraxDialogSets({ children }: TraxDialogSetsProps) {
    return (
        <FlexLayout direction="row">
            {children}
        </FlexLayout>
    );
}
