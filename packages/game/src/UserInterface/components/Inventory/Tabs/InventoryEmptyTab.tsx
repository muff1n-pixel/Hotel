import { useContext } from "react";
import DialogButton from "../../Dialog/Button/DialogButton";
import { AppContext } from "../../../contexts/AppContext";
import { useDialogs } from "../../../hooks/useDialogs";

export default function InventoryEmptyTab() {
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
                <b style={{ color: "#E12827" }}>This category seems to be empty!</b>

                <p>You have either placed all your furniture in your rooms or have not purchased any yet.</p>
                <p>Check the Habbo shop to see what's available!</p>

                <DialogButton onClick={() => addUniqueDialog("shop")}>Open shop</DialogButton>
            </div>
        </div>
    );
}
