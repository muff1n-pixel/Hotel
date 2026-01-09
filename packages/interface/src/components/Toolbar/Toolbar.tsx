import { useContext } from "react";
import ToolbarFigureItem from "./Items/ToolbarFigureItem";
import ToolbarItem from "./Items/ToolbarItem";
import { AppContext } from "../../contexts/AppContext";
import WardrobeDialog from "../Wardrobe/WardrobeDialog";

export default function Toolbar() {
    const { addUniqueDialog } = useContext(AppContext);

    return (
        <div style={{
            position: "absolute",
            
            left: 0,
            bottom: 0,

            width: "100%",
            height: 47,

            background: "rgba(28, 28, 26, .9)",

            borderTop: "2px solid rgba(64, 64, 64, .75)",
            borderBottom: "1px solid rgba(64, 64, 64, .75)",
            
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",

            pointerEvents: "auto"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 14,
                alignItems: "center"
            }}>
                <div/>

                {/*<ToolbarItem>
                    <div className="sprite_toolbar_logo"/>
                </ToolbarItem>*/}

                <ToolbarItem onClick={() => {
                    addUniqueDialog({
                        name: "wardrobe",
                        element: (<WardrobeDialog/>)
                    })
                }}>
                    <ToolbarFigureItem/>
                </ToolbarItem>
            </div>
        </div>
    );
}
