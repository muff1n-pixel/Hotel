import { useTranslation } from "react-i18next";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { useDialogs } from "../../../Hooks/useDialogs";

export default function InventoryEmptyTab() {
    const [getTranslation] = useTranslation("inventory");
    const { addUniqueDialog } = useDialogs();

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "row"
        }}>
            <div style={{
                flex: 1,

                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div className="sprite_inventory_shop"/>
            </div>

            <div style={{
                width: 200,

                display: "flex",
                gap: 10,
                flexDirection: "column",

                justifyContent: "center",

                fontSize: 13
            }}>
                <b style={{ color: "#E12827" }}>{getTranslation("empty.category_is_empty")}</b>

                <p>{getTranslation("empty.all_furniture_in_room")}</p>
                <p>{getTranslation("empty.explore_habbo_shop")}</p>

                <DialogButton onClick={() => addUniqueDialog("shop")}>{getTranslation("empty.open_shop")}</DialogButton>
            </div>
        </div>
    );
}
