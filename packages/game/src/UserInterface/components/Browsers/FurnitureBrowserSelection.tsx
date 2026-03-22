import { FurnitureData } from "@pixel63/events";
import Input from "@UserInterface/Common/Form/Components/Input";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment } from "react/jsx-runtime";

export type FurnitureBrowserSelectionProps = {
    furniture?: FurnitureData;
    onChange?: (furniture: FurnitureData) => void;
}

export default function FurnitureBrowserSelection({ furniture, onChange }: FurnitureBrowserSelectionProps) {
    const dialogs = useDialogs();

    return (
        <Fragment>
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <b>Furniture</b>

                {(furniture) && (
                    <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                        dialogs.addUniqueDialog("edit-furniture", { ...furniture, onClose: onChange });
                    }}>
                        Edit furniture
                    </div>
                )}
            </div>

            <Input readonly placeholder="Furniture" value={(furniture)?(`${furniture.type}${(furniture.color)?(`*${furniture.color}`):("")}`):("")}/>
                
            <div style={{
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <div style={{ fontSize: 12, textDecoration: "underline", cursor: "pointer" }} onClick={() => {
                    dialogs.addUniqueDialog("furniture-browser", {
                        activeFurniture: furniture,
                        onSelect: onChange
                    });
                }}>
                    Open furniture browser
                </div>
            </div>
        </Fragment>
    );
}
