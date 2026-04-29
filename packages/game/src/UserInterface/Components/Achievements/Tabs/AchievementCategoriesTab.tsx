import { AchievementsCategoryData } from "@pixel63/events";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import ProgressBar from "@UserInterface/Common/Dialog/Components/ProgressBar/ProgressBar";
import AchievementCategoryItem from "@UserInterface/Components/Achievements/Components/AchievementCategoryItem";
import { useMemo } from "react";

export type AchievementCategoriesTabProps = {
    categories: AchievementsCategoryData[];
    onChange: (category: AchievementsCategoryData) => void;
}

export default function AchievementCategoriesTab({ categories, onChange }: AchievementCategoriesTabProps) {
    const totalUnlockedAchievementLevels = useMemo(() => categories.reduce((total, category) => category.userUnlockedLevels + total, 0), [categories]);
    const totalAchievementLevels = useMemo(() => categories.reduce((total, category) => category.totalLevels + total, 0), [categories]);

    const totalAchievementScore = useMemo(() => categories.reduce((total, category) => category.userLevelScore + total, 0), [categories]);

    return (
        <DialogContent style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
                rowGap: 10,
                flexWrap: "wrap",
                padding: 1
            }}>
                {categories.map((category) => (
                    <AchievementCategoryItem key={category.id} category={category} onClick={() => (category.totalLevels > 0) && onChange(category)}/>
                ))}
            </div>

            <div style={{
                color: "#50504F",

                display: "flex",
                flexDirection: "column",
                gap: 5,

                alignItems: "center"
            }}>
                <div>
                    <ProgressBar value={totalUnlockedAchievementLevels ?? 0} maxValue={totalAchievementLevels ?? 0} label={`Total Achievement: ${totalUnlockedAchievementLevels ?? 0}/${totalAchievementLevels ?? 0}`}/>
                </div>

                <b>Achievement score: {totalAchievementScore ?? 0}</b>
            </div>
        </DialogContent>
    );
}
