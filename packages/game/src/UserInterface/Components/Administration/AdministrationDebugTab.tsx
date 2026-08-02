import DataStats from "@Client/DataStats";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import useAnimationFrame from "@UserInterface/Hooks/useAnimationFrame";
import { useState } from "react";

export default function AdministrationDebugTab() {
    const [landscapeImageBitmapsOpened, setLandscapeImageBitmapsOpened] = useState(0);
    const [landscapeImageBitmapsClosed, setLandscapeImageBitmapsClosed] = useState(0);

    useAnimationFrame(() => {
        setLandscapeImageBitmapsOpened(DataStats.landscapeImageBitmapsOpened);
        setLandscapeImageBitmapsClosed(DataStats.landscapeImageBitmapsClosed);
    });

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 8,
        }}>
            <b>ImageBitmaps</b>

            <DialogTable
                columns={["Asset", "Opened", "Closed", "Active"]}
                items={[
                    {
                        id: "landscape",
                        values: [
                            "Landscape",
                            landscapeImageBitmapsOpened,
                            landscapeImageBitmapsClosed,
                            (landscapeImageBitmapsOpened - landscapeImageBitmapsClosed)
                        ]
                    },
                    
                    {
                        id: "furniture",
                        values: [
                            "Furniture",
                            DataStats.furnitureImageBitmapsOpened,
                            DataStats.furnitureImageBitmapsClosed,
                            (DataStats.furnitureImageBitmapsOpened - DataStats.furnitureImageBitmapsClosed)
                        ]
                    },
                    
                    {
                        id: "figure",
                        values: [
                            "Figure",
                            DataStats.figureImageBitmapsOpened,
                            DataStats.figureImageBitmapsClosed,
                            (DataStats.figureImageBitmapsOpened - DataStats.figureImageBitmapsClosed)
                        ]
                    }
                ]}
                />
        </div>
    );
}
