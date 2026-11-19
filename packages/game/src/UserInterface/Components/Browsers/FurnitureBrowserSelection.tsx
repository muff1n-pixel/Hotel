import { FurnitureData } from "@pixel63/events";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

export type FurnitureBrowserSelectionProps = {
    furniture?: FurnitureData[];
    onChange?: (furniture: FurnitureData[]) => void;
    allowMultiple?: boolean;
}

export default function FurnitureBrowserSelection({ allowMultiple, furniture, onChange }: FurnitureBrowserSelectionProps) {
    const dialogs = useDialogs();
    const [getTranslation] = useTranslation("furniture");

    return (
        <Fragment>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <b>{getTranslation("selection.title")}</b>

                {(furniture?.length === 1) && (
                    <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                        dialogs.addUniqueDialog("edit-furniture", { ...furniture[0], onClose: onChange });
                    }}>
                        {getTranslation("selection.edit")}
                    </div>
                )}
            </div>

            <Input readonly placeholder={getTranslation("selection.placeholder")} value={(furniture?.length === 1)?(`${furniture[0].type}${(furniture[0].color)?(`*${furniture[0].color}`):("")}`):(getTranslation("selection.items", { count: furniture?.length ?? 0 }))}/>
                
            <div style={{
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                    dialogs.addUniqueDialog("furniture-browser", {
                        activeFurniture: furniture,
                        allowMultipleItems: allowMultiple,
                        onSelect: onChange
                    });
                }}>
                    {getTranslation("selection.open_browser")}
                </div>
            </div>
        </Fragment>
    );
}
