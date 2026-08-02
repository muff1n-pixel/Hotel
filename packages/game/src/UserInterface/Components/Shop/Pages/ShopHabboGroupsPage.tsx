import { ShopPageProps } from "./ShopPage";
import { useDialogs } from "../../../Hooks/useDialogs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

export default function ShopHabboGroupsPage({ page }: ShopPageProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("shop");

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <FlexLayout flex={1} direction="column" justify="center" align="center" style={{
                padding: "2em 0"
            }}>
                <FlexLayout style={{ flex: 1 }}>
                    {getTranslation("group.paragraph").split('\n').map((line) => <p key={line}>{line}</p>)}

                    <b>{getTranslation("group.title")}</b>

                    <p>{getTranslation("group.items")}</p>

                    <p>
                        {getTranslation("group.items").split('\n').map((line) => <Fragment key={line}>* {line}<br/></Fragment>)}
                    </p>
                </FlexLayout>

                {(page.teaser) && (
                    <FlexLayout direction="row" justify="center" align="center">
                        <img src={`./assets/shop/teasers/${page.teaser}`}/>
                    </FlexLayout>
                )}

                <div style={{ flex: 1 }}/>

                <DialogButton color="green" onClick={() => {
                    dialogs.addUniqueDialog("room-group-creation", {
                        page
                    });
                }}>
                    {getTranslation("group.create")}
                </DialogButton>
            </FlexLayout>
        </div>
    );
}
