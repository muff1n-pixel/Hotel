import DataStats from "@Client/DataStats";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import useAnimationFrame from "@UserInterface/Hooks/useAnimationFrame";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AdministrationDebugTab() {
    const [getTranslation] = useTranslation("administration");
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
            <b>{getTranslation("debug.image_bitmaps")}</b>

            <DialogTable
                columns={["asset", "opened", "closed", "active"].map((key) => getTranslation(`debug.${key}`))}
                items={[
                    {
                        id: "landscape",
                        values: [
                            getTranslation("debug.landscape"),
                            landscapeImageBitmapsOpened,
                            landscapeImageBitmapsClosed,
                            (landscapeImageBitmapsOpened - landscapeImageBitmapsClosed)
                        ]
                    },
                    
                    {
                        id: "furniture",
                        values: [
                            getTranslation("debug.furniture"),
                            DataStats.furnitureImageBitmapsOpened,
                            DataStats.furnitureImageBitmapsClosed,
                            (DataStats.furnitureImageBitmapsOpened - DataStats.furnitureImageBitmapsClosed)
                        ]
                    },
                    
                    {
                        id: "figure",
                        values: [
                            getTranslation("debug.figure"),
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
