import { useEffect, useState } from "react";
import Dialog from "../Dialog/Dialog";
import DialogSubTabs from "../Dialog/Tabs/DialogSubTabs";
import DialogTabs from "../Dialog/Tabs/DialogTabs";
import WardrobeAvatar from "./WardrobeAvatar";
import WardrobeSelection from "./Selection/WardrobeSelection";
import DialogButton from "../Dialog/Button/DialogButton";
import { FigureConfiguration, FigurePartKeyAbbreviation } from "@Shared/Interfaces/Figure/FigureConfiguration";

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

export type FigureWardrobeDialogProps = {
    title: string;
    initialFigureConfiguration: FigureConfiguration;

    hidden?: boolean;
    onClose?: () => void;

    onApply: (figureConfiguration: FigureConfiguration) => void;
};

export default function FigureWardrobeDialog({ title, initialFigureConfiguration, hidden, onApply, onClose }: FigureWardrobeDialogProps) {
    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfiguration>(initialFigureConfiguration);

    useEffect(() => {
        setFigureConfiguration(initialFigureConfiguration);
    }, [initialFigureConfiguration]);
    
    return (
        <Dialog title="Wardrobe" hidden={hidden} onClose={onClose} width={500} height={530}>
            <DialogTabs initialActiveIndex={0} header={{ title }} tabs={[
                {
                    icon: (<div className="sprite_wardrobe_generic_tab"/>),
                    element: (
                        <div style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "row",
                            gap: 10
                        }}>
                            <DialogSubTabs activeIndex={(figureConfiguration.gender === "male")?(0):(1)} onTabChange={(index) => {
                                setFigureConfiguration({
                                    ...figureConfiguration,
                                    gender: (index === 0)?("male"):("female")
                                });
                            }} tabs={[
                                {
                                    icon: (<div className="sprite_wardrobe_male"/>),
                                    activeIcon: (<div className="sprite_wardrobe_male_on"/>),
                                    element: (
                                        <WardrobeSelection part={"hd" as FigurePartKeyAbbreviation} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration}/>
                                    )
                                },
                                {
                                    icon: (<div className="sprite_wardrobe_female"/>),
                                    activeIcon: (<div className="sprite_wardrobe_female_on"/>),
                                    element: (
                                        <WardrobeSelection part={"hd" as FigurePartKeyAbbreviation} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration}/>
                                    )
                                }
                            ]}/>

                            <div style={{
                                flex: 1,

                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <div style={{
                                    width: 130,
                                    height: "100%"
                                }}>
                                    <WardrobeAvatar configuration={figureConfiguration}/>
                                </div>

                                <div style={{ width: "100%" }}>
                                    <DialogButton onClick={() => onApply(figureConfiguration)}>Save my looks</DialogButton>
                                </div>
                            </div>
                        </div>
                    )
                },
                ...wardrobeTabs.map((wardrobeTab) => {
                    return {
                        icon: (<div className={wardrobeTab.spriteName}/>),
                        element: (
                            <div style={{
                                flex: 1,

                                display: "flex",
                                flexDirection: "row",
                                gap: 10
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

                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                    <div style={{
                                        width: 130,
                                        height: "100%"
                                    }}>
                                        <WardrobeAvatar configuration={figureConfiguration}/>
                                    </div>

                                    <div style={{ width: "100%" }}>
                                        <DialogButton onClick={() => onApply(figureConfiguration)}>Save my looks</DialogButton>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
            ]}/>
        </Dialog>
    )
}
