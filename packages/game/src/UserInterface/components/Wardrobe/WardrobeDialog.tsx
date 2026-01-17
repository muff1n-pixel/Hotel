import { useContext, useEffect, useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogSubTabs from "../Dialog/Tabs/DialogSubTabs";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import WardrobeAvatar from "./WardrobeAvatar";
import WardrobeSelection from "./Selection/WardrobeSelection";
import { FigureConfiguration, FigurePartKeyAbbreviation } from "@Shared/Interfaces/Figure/FigureConfiguration";
import { AppContext } from "../../contexts/AppContext";

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
    },
    {
        spriteName: "sprite_wardrobe_legs_tab",
        tabs: [
            {
                part: "lg" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_trousers",
            },
            {
                part: "sh" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_shoes",
            },
            {
                part: "wa" satisfies FigurePartKeyAbbreviation,
                spriteName: "sprite_wardrobe_accessories",
            }
        ]
    }
];

export type WardrobeDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
};

export default function WardrobeDialog({ hidden, onClose }: WardrobeDialogProps) {
    const { user } = useContext(AppContext);

    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfiguration>(user?.figureConfiguration ?? []);

    useEffect(() => {
        if(!user) {
            return;
        }

        setFigureConfiguration(user.figureConfiguration);
    }, [user?.figureConfiguration]);
    
    return (
        <Dialog title="Wardrobe" hidden={hidden} onClose={onClose} width={500} height={530}>
            <DialogTabs initialActiveIndex={1} header={{ title: user?.name }} tabs={[
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
                })
            ]}/>
        </Dialog>
    )
}
