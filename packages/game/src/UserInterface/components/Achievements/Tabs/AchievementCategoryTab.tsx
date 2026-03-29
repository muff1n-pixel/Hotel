import { AchievementData, AchievementsCategoryData } from "@pixel63/events";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import ProgressBar from "@UserInterface/Common/Dialog/Components/ProgressBar/ProgressBar";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import AchievementItem from "@UserInterface/Components/Achievements/Components/AchievementItem";
import { useAchievements } from "@UserInterface/Components/Achievements/Hooks/useAchievements";
import { Fragment, useEffect, useState } from "react";

export type AchievementCategoryTabProps = {
    category: AchievementsCategoryData;
    onClose: () => void;
}

export default function AchievementCategoryTab({ category, onClose }: AchievementCategoryTabProps) {
    const achievements = useAchievements(category.id);

    const [activeAchievement, setActiveAchievement] = useState<AchievementData>();

    useEffect(() => {
        if(!activeAchievement && achievements?.length) {
            console.log(achievements[0]);
            setActiveAchievement(achievements[0]);
        }
    }, [achievements]);

    return (
        <Fragment>
            <FlexLayout direction="row" align="center" gap={20} style={{
                background: "#8899A2",
                borderBottom: "1px solid #000000",

                padding: "16px 16px"
            }}>
                <div className="sprite_back" onClick={onClose} style={{
                    cursor: "pointer"
                }}/>

                <FlexLayout flex={1} gap={2} style={{
                    fontFamily: "Ubuntu Bold"
                }}>
                    <div style={{ fontSize: 20 }}>{category.name}</div>

                    <div style={{ fontSize: 13 }}>{category.userUnlockedLevels}/{category.totalLevels} badges collected</div>
                </FlexLayout>

                <img src={`/assets/achievements/icons/${category.iconImage}`}/>
            </FlexLayout>

            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <FlexLayout direction="row" gap={0} style={{
                    flexWrap: "wrap"
                }}>
                    {achievements?.map((achievement) => (
                        <AchievementItem key={achievement.id} achievement={achievement} active={achievement.id === activeAchievement?.id} onClick={() => setActiveAchievement(achievement)}/>
                    ))}
                </FlexLayout>

                {(activeAchievement) && (
                    <FlexLayout direction="row" style={{
                        border: "1px solid #5D5D5A",
                        borderRadius: 6,

                        height: 100,

                        background: "#CBCBCB",

                        padding: "12px 6px"
                    }}>
                        <FlexLayout direction="column" align="center" gap={0}>
                            <div style={{
                                width: 100,
                                height: 100,

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                transform: "scale(2)",
                                imageRendering: "pixelated"
                            }}>
                                {(activeAchievement.currentBadge)?(
                                    <BadgeImage badge={activeAchievement.currentBadge}/>
                                ):(
                                    <div className="sprite_question" style={{
                                        filter: "grayscale(100%)"
                                    }}/>
                                )}
                            </div>

                            <div style={{
                                fontFamily: "Ubuntu Bold",
                                fontSize: 12
                            }}>
                                Level {(activeAchievement.currentBadge)?(activeAchievement.userLevel):("??")}/{(activeAchievement.currentBadge)?(activeAchievement.levels):("??")}
                            </div>
                        </FlexLayout>

                        <FlexLayout flex={1} gap={0}>
                            <b>{(activeAchievement.currentBadge)?(activeAchievement.currentBadge?.name):("??? ??? ??")}</b>
                            <p>{(activeAchievement.currentBadge)?(activeAchievement.currentBadge?.description):("?? ? ?? ?? ??? ??? ??")}</p>

                            <div style={{ flex: 1 }}/>

                            {(activeAchievement.currentUserScore < activeAchievement.currentLevelScore) && (
                                <div style={{
                                    width: "100%",
                                    justifySelf: "flex-end"
                                }}>
                                    <ProgressBar value={activeAchievement.currentUserScore - activeAchievement.currentLevelScore} maxValue={activeAchievement.nextLevelScore - activeAchievement.currentLevelScore} label={`${activeAchievement.currentUserScore}/${activeAchievement.nextLevelScore}`}/>
                                </div>
                            )}

                        </FlexLayout>
                    </FlexLayout>
                )}
            </DialogContent>
        </Fragment>
    );
}
