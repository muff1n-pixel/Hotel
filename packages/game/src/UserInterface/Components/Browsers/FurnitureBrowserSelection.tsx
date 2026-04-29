import { FurnitureData } from "@pixel63/events";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment } from "react/jsx-runtime";

export type FurnitureBrowserSelectionProps = {
    furniture?: FurnitureData[];
    onChange?: (furniture: FurnitureData[]) => void;
    allowMultiple?: boolean;
}

export default function FurnitureBrowserSelection({ allowMultiple, furniture, onChange }: FurnitureBrowserSelectionProps) {
    const dialogs = useDialogs();

    return (
        <Fragment>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <b>Furniture</b>

                {(furniture?.length === 1) && (
                    <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                        dialogs.addUniqueDialog("edit-furniture", { ...furniture[0], onClose: onChange });
                    }}>
                        Edit furniture
                    </div>
                )}
            </div>

            <Input readonly placeholder="Furniture" value={(furniture?.length === 1)?(`${furniture[0].type}${(furniture[0].color)?(`*${furniture[0].color}`):("")}`):(`${furniture?.length} items`)}/>
                
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
                    Open furniture browser
                </div>
            </div>
        </Fragment>
    );
}
