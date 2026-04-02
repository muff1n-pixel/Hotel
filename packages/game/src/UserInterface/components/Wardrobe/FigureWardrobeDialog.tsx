import { useEffect, useState } from "react";
import Dialog from "../../Common/Dialog/Dialog";
import DialogSubTabs from "../../Common/Dialog/Components/Tabs/DialogSubTabs";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import WardrobeAvatar from "./WardrobeAvatar";
import WardrobeSelection from "./Selection/WardrobeSelection";
import DialogButton from "../../Common/Dialog/Components/Button/DialogButton";
import { FigureConfigurationData, GetUserClothesData, UserClothesData, UserClothingData } from "@pixel63/events";
import { webSocketClient } from "src";
import { usePermissionAction } from "@UserInterface/Hooks/usePermissionAction";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import WardrobeFigures from "@UserInterface/Components/Wardrobe/Components/WardrobeFigures";
import WardrobeEffects from "@UserInterface/Components/Wardrobe/Selection/WardrobeEffects";
import WardrobeHotlooks from "@UserInterface/Components/Wardrobe/Components/WardrobeHotlooks";

const wardrobeTabs = [
    {
        spriteName: "sprite_wardrobe_head_tab",
        tabs: [
            {
                part: "hr",
                spriteName: "sprite_wardrobe_head_hair",
            },
            {
                part: "ha",
                spriteName: "sprite_wardrobe_head_hats",
            },
            {
                part: "fa",
                spriteName: "sprite_wardrobe_head_accessories",
            },
            {
                part: "ea",
                spriteName: "sprite_wardrobe_head_eyewear",
            },
            {
                part: "he",
                spriteName: "sprite_wardrobe_head_face_accesories",
            }
        ]
    },
    {
        spriteName: "sprite_wardrobe_torso_tab",
        tabs: [
            {
                part: "ch",
                spriteName: "sprite_wardrobe_top_shirt",
            },
            {
                part: "cp",
                spriteName: "sprite_wardrobe_top_prints",
            },
            {
                part: "cc",
                spriteName: "sprite_wardrobe_top_jacket",
            },
            {
                part: "ca",
                spriteName: "sprite_wardrobe_top_accessories",
            }
        ]
    },
    {
        spriteName: "sprite_wardrobe_legs_tab",
        tabs: [
            {
                part: "lg",
                spriteName: "sprite_wardrobe_trousers",
            },
            {
                part: "sh",
                spriteName: "sprite_wardrobe_shoes",
            },
            {
                part: "wa",
                spriteName: "sprite_wardrobe_accessories",
            }
        ]
    }
];

export type FigureWardrobeDialogProps = {
    title: string;
    header: string;
    initialFigureConfiguration?: FigureConfigurationData;

    hidden?: boolean;
    onClose?: () => void;

    onApply: (figureConfiguration: FigureConfigurationData) => void;
};

export default function FigureWardrobeDialog({ title, header, initialFigureConfiguration, hidden, onApply, onClose }: FigureWardrobeDialogProps) {
    const hasClothingEditPermissions = usePermissionAction("clothing:edit");

    const [editMode, setEditMode] = useState(false);
    const [figuresExpanded, setFiguresExpanded] = useState(false);

    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfigurationData | undefined>(initialFigureConfiguration);

    useEffect(() => {
        setFigureConfiguration(initialFigureConfiguration);
    }, [initialFigureConfiguration]);

    if(!figureConfiguration) {
        return null;
    }
    
    return (
        <Dialog title={title} hidden={hidden} onClose={onClose} width={520 + ((figuresExpanded)?(166):(0))} height={530} onEditClick={(hasClothingEditPermissions) && (() => setEditMode(!editMode))}>
            <FlexLayout flex={1} direction="row" gap={0}>
                <DialogTabs initialActiveIndex={0} header={{ title: header }} tabs={[
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
                                            <WardrobeSelection part={"hd"} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} editMode={editMode}/>
                                        )
                                    },
                                    {
                                        icon: (<div className="sprite_wardrobe_female"/>),
                                        activeIcon: (<div className="sprite_wardrobe_female_on"/>),
                                        element: (
                                            <WardrobeSelection part={"hd"} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} editMode={editMode}/>
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

                                {(figuresExpanded) && (
                                    <WardrobeFigures figureConfiguration={figureConfiguration} onFigureChange={setFigureConfiguration}/>
                                )}
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
                                            element: (<WardrobeSelection part={tab.part} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} editMode={editMode}/>)
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

                                    {(figuresExpanded) && (
                                        <WardrobeFigures figureConfiguration={figureConfiguration} onFigureChange={setFigureConfiguration}/>
                                    )}
                                </div>
                            )
                        }
                    }),

                    {
                        icon: (<div className={"sprite_wardrobe_effects_tab"}/>),
                        element: (
                            <div style={{
                                flex: 1,

                                display: "flex",
                                flexDirection: "row",
                                gap: 10
                            }}>
                                <WardrobeEffects figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} editMode={editMode}/>

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

                                {(figuresExpanded) && (
                                    <WardrobeFigures figureConfiguration={figureConfiguration} onFigureChange={setFigureConfiguration}/>
                                )}
                            </div>
                        )
                    },

                    {
                        icon: (<div className={"sprite_wardrobe_hotlooks_tab"}/>),
                        element: (
                            <div style={{
                                flex: 1,

                                display: "flex",
                                flexDirection: "row",
                                gap: 10
                            }}>
                                <WardrobeHotlooks figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} editMode={editMode}/>

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

                                {(figuresExpanded) && (
                                    <WardrobeFigures figureConfiguration={figureConfiguration} onFigureChange={setFigureConfiguration}/>
                                )}
                            </div>
                        )
                    },

                    {
                        alignSelf: "flex-end",
                        transparent: true,
                        icon: (<div className="sprite_wardrobe_wardrobe_tab"/>),
                        element: null,
                        onClick: () => setFiguresExpanded(!figuresExpanded)
                    }
                ]}/>
            </FlexLayout>
        </Dialog>
    )
}
