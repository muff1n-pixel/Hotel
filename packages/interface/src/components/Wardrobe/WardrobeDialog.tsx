import { useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogSubTabs from "../Dialog/DialogSubTabs";
import DialogTabs from "../Dialog/DialogTabs";

import { FigureConfiguration, FigurePartKeyAbbreviation } from "@shared/interfaces/figure/FigureConfiguration";
import FigureConfigurationHelper from "@shared/figure/FigureConfigurationHelper";
import WardrobeAvatar from "./WardrobeAvatar";
import WardrobeSelection from "./Selection/WardrobeSelection";

const wardrobeTabs = [
    {
        spriteName: "sprite_wardrobe_head_tab",
        tabs: [
            {
                part: "hr" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_head_hair",
            },
            {
                part: "ha" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_head_hats",
            },
            {
                part: "fa" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_head_accessories",
            },
            {
                part: "ea" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_head_eyewear",
            },
            {
                part: "he" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_head_face_accesories",
            }
        ]
    },
    {
        spriteName: "sprite_wardrobe_torso_tab",
        tabs: [
            {
                part: "ch" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_top_shirt",
            },
            {
                part: "cp" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_top_prints",
            },
            {
                part: "cc" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_top_jacket",
            },
            {
                part: "ca" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_top_accessories",
            }
        ]
    }
];

export default function WardrobeDialog() {
    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfiguration>(FigureConfigurationHelper.getConfigurationFromString("hd-180-2.hr-828-31.ea-3196-62.ch-255-1415.lg-3216-110.sh-305-62"));
    
    return (
        <Dialog title="Wardrobe">
            <DialogTabs initialActiveIndex={1} tabs={[
                {
                    icon: (<div className="sprite_wardrobe_generic_tab"/>),
                    element: (
                        <DialogSubTabs tabs={[
                            {
                                icon: (<div className="sprite_wardrobe_male"/>),
                                activeIcon: (<div className="sprite_wardrobe_male_on"/>),
                                element: (<div>male</div>)
                            },
                            {
                                icon: (<div className="sprite_wardrobe_female"/>),
                                activeIcon: (<div className="sprite_wardrobe_female_on"/>),
                                element: (<div>female</div>)
                            }
                        ]}/>
                    )
                },
                ...wardrobeTabs.map((wardrobeTab) => {
                    return {
                        icon: (<div className={wardrobeTab.spriteName}/>),
                        element: (
                            <div style={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <DialogSubTabs tabs={wardrobeTab.tabs.map((tab) => {
                                    return {
                                        icon: (<div className={tab.spriteName}/>),
                                        activeIcon: (<div className={`${tab.spriteName}_on`}/>),
                                        element: (<WardrobeSelection part={tab.part as FigurePartKeyAbbreviation} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration}/>)
                                    };
                                })}/>

                                <div style={{
                                    flex: 1,
                                    width: 130,
                                    height: "100%"
                                }}>
                                    <WardrobeAvatar configuration={figureConfiguration}/>
                                </div>
                            </div>
                        )
                    }
                }),
                {
                    icon: (<div className="sprite_wardrobe_torso_tab"/>),
                    element: <div>test</div>
                },
                {
                    icon: (<div className="sprite_wardrobe_legs_tab"/>),
                    element: <div>test</div>
                }
            ]}/>
        </Dialog>
    )
}
