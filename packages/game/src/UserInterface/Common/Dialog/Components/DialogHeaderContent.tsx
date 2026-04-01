import { DialogTabHeaderProps } from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { PropsWithChildren } from "react";

export type DialogHeaderContentProps = PropsWithChildren & {
    header: DialogTabHeaderProps;
};

export default function DialogHeaderContent({ header }: DialogHeaderContentProps) {
    return (
        <div style={{
            backgroundImage: `url(${header.backgroundImage})`,
            backgroundSize: "cover",
            backgroundColor: header.backgroundColor,

            padding: 20,

            display: "flex",
            flexDirection: "row",
            gap: 20,

            fontSize: 14
        }}>
            <FlexLayout align="center" justify="center">
                {(header.icon) && (
                    header.icon
                )}

                {(header.iconImage) && (
                    <img src={header.iconImage}/>
                )}
            </FlexLayout>

            <FlexLayout gap={5}>
                <div><b>{header.title}</b></div>
                <div>{header.description}</div>
            </FlexLayout>
        </div>
    );
}
