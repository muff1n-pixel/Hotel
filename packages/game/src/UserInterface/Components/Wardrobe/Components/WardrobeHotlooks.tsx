import { useCallback } from "react";
import { FigureConfigurationData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import { useDialogs } from "@UserInterface/Hooks2/useDialogs";
import useEffects from "@UserInterface/Components/Wardrobe/Hooks/useEffects";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WardrobeSelectionItem from "@UserInterface/Components/Wardrobe/Selection/WardrobeSelectionItem";
import FigureConfigurationHelper from "@pixel63/shared/Figure/FigureConfigurationHelper";
import WardrobeSelectionSquareItem from "@UserInterface/Components/Wardrobe/Selection/WardrobeSelectionSquareItem";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";

// TODO: move to server

const hotlooks = {
    male: [
        "hr-802-42.hd-180-8.ch-225-1408.lg-285-64.sh-300-1408.he-1605-1408.cc-260-84",
        "hr-893-45.hd-209-10.ch-255-64.lg-3023-64.sh-300-64.ha-1005-64",
        "hr-802-42.hd-190-1371.ch-225-1408.lg-285-64.sh-300-64.ha-1023-64.ca-1813",
        "hr-893-42.hd-206-10.ch-3030-73.lg-275-64.sh-295-64.ha-3117-64.ca-1801-64",
        "hr-165-45.hd-209-1.ch-3030-64.lg-3116-82-82.sh-295-1408.he-1608",
        "hr-893-40.hd-207-1.ch-3030-64.lg-3023-1408.sh-300-64",
        "hr-135-36.hd-209-8.ch-225-1408.lg-285-64.sh-300-64.ha-1023-64.he-1605-73.cp-3121-1408",
        "hr-802-40.hd-206-10.ch-265-82.lg-3023-64.sh-290-64.ea-1406.cc-3294-84-85",
        "hr-893-42.hd-209-10.ch-225-64.lg-285-64.sh-300-64",
        "hr-125-34.hd-190-30.ch-804-73.lg-285-90.sh-295-1408.fa-1206-1320",
        "hr-155-42.hd-180-10.ch-220-66.lg-285-64.sh-300-1408.ea-1404-64",
        "hr-145-42.hd-209-14.ch-255-73.lg-270-1408.sh-3068-1408-1408",
        "hr-893-31.hd-185-1.ch-255-82.lg-3078-1408.sh-3068-1408-82.ha-1002-64",
        "hr-802-42.hd-209-1.ch-255-73.lg-3023-64.sh-3068-1408-64.ha-1004-85",
        "hr-893-45.hd-190-1.ch-3030-73.lg-275-1408.sh-295-1408.ha-3117-1408.ea-1406.cp-3286",
        "hr-115-31.hd-185-10.ch-255-73.lg-3023-73.sh-906-72",
        "hr-125-45.hd-180-1370.ch-3030-64.lg-285-82.sh-300-1408",
        "hr-802-45.hd-180-1370.ch-807-85.lg-285-82.sh-300-91.ea-1404-64.fa-1206-91",
        "hr-125-42.hd-180-1371.ch-225-82.lg-285-64.sh-300-64.ha-1023-64.he-1605-1408.ea-1403-64.fa-1201",
        "hr-3090-40.hd-209-14.ch-210-1408.lg-281-1408.sh-300-1408.fa-3276-1408",
        "hr-170-45.hd-195-1.ch-3030-90.lg-285-1408.sh-300-1408.ha-1009-66.fa-1206-64",
        "hr-679-42.hd-209-1.ch-255-73.lg-3023-73.sh-290-72.ha-3117-73.fa-3276-1408.ca-1802.wa-2011.cp-3286",
        "hr-135-45.hd-205-1.ch-210-1408.lg-3023-85.sh-300-85.ea-1403-64.fa-1206-64.cc-3294-85-1408"
    ].slice(0, 14).map((config) => FigureConfigurationHelper.getConfigurationFromString(config)),
    female: [
        "hd-628-1371.ch-665-1408.lg-3078-72.he-3274-72.ea-1406",
        "hr-575-31.hd-615-10.ch-660-73.lg-3216-82.he-1610",
        "hr-890-34.hd-629-1.ch-665-91.lg-720-64.sh-735-64.ha-1023-64",
        "hr-515-42.hd-600-10.ch-660-71.lg-715-81.sh-735-1408",
        "hr-837-40.hd-610-30.ch-820-82-1408.lg-3088-1408-85.sh-725-82.ea-1401-1408.ca-1801-1408",
        "hr-540-45.hd-600-10.ch-665-1320.lg-720-64.sh-735-64.ha-1023-64.he-1605-1408",
        "hr-540-38.hd-627-10.ch-665-64.lg-3023-88.sh-740-1408",
        "hr-500-31.hd-605-1.ch-650-74.lg-715-80.sh-730-74.he-1610.fa-3276-73",
        "hr-890-39.hd-629-10.ch-879-1408.lg-3216-1408.sh-735-64.he-1605-72.fa-3276-72.ca-1803-1408",
        "hr-515-39.hd-625-1370.ch-685-64.lg-700-71",
        "hr-890-42.hd-600-10.ch-665-73.lg-3216-64.sh-908-73.he-3274-64",
        "hr-890-31.hd-629-1.ch-665-1408.lg-3216-73.he-3274-73.fa-3276-71",
        "hr-555-39.hd-626-10.ch-665-72.lg-700-64.wa-2001",
        "hr-890-42.hd-600-10.ch-665-82.lg-720-64.sh-735-64.ha-1023-64.he-1605-90.ea-1406",
        "hr-890-37.hd-600-14.ch-665-73.lg-3216-64.sh-907-1408.wa-3210-1408-1408",
        "hr-890-47.hd-627-10.ch-660-82.lg-696-82.sh-730-82.ha-3117-82.he-1608.fa-3276-72",
        "hr-890-42.hd-600-10.ch-655-73.lg-3216-73.sh-735-73.fa-3276-73.wa-3210-64-1408",
        "hr-890-38.hd-627-1.ch-665-71.lg-715-76.he-3274-76",
        "hr-890-42.hd-620-1.ch-660-73.lg-710-64.sh-906-64",
        "hr-540-45.hd-627-10.ch-665-1408.lg-720-64.sh-735-64.ha-1023-64.he-1605-72",
        "hr-890-34.hd-600-10.ch-660-1408.lg-720-1408.sh-735-1408"
    ].slice(0, 14).map((config) => FigureConfigurationHelper.getConfigurationFromString(config))
}

export type WardrobeHotlooksProps = {
    figureConfiguration: FigureConfigurationData;

    onFigureConfigurationChange: (figureConfiguration: FigureConfigurationData) => void;
    editMode: boolean;
};

export default function WardrobeHotlooks({ figureConfiguration, onFigureConfigurationChange, editMode }: WardrobeHotlooksProps) {
    const dialogs = useDialogs();

    const effects = useEffects();

    const handleEquip = useCallback((effect: number) => {
        if(editMode) {
            return;
        }

        onFigureConfigurationChange({
            ...figureConfiguration,
            effect
        });
    }, [editMode]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,

            width: (6 * 50) + 20,
        }}>
            <div>
                <h2>Hot looks from the Hotel!</h2>

                <p>Pick and choose from one of the hot looks from the Hotel!</p>
            </div>

            <DialogScrollArea hideInactive style={{
                height: 4 * 50,
                overflow: "hidden",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 5
                }}>
                    {hotlooks[figureConfiguration.gender as "male" | "female"]?.map((hotlook, index) => (
                        <WardrobeSelectionSquareItem key={figureConfiguration.gender + index} style={{ width: 40 }} onClick={() => {
                            onFigureConfigurationChange({
                                ...hotlook,
                                gender: figureConfiguration.gender
                            });
                        }}>
                            <FigureImage figureConfiguration={hotlook} direction={2}/>
                        </WardrobeSelectionSquareItem>
                    ))}
                </div>
            </DialogScrollArea>
        </div>
    );
}
