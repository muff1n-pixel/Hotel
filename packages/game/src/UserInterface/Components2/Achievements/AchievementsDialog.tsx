import { AchievementsCategoryData } from "@pixel63/events";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import { useAchievementCategories } from "@UserInterface/Components2/Achievements/Hooks/useAchievementCategories";
import AchievementCategoriesTab from "@UserInterface/Components2/Achievements/Tabs/AchievementCategoriesTab";
import AchievementCategoryTab from "@UserInterface/Components2/Achievements/Tabs/AchievementCategoryTab";
import { useState } from "react";

export type AchievementsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function AchievementsDialog({ hidden, onClose }: AchievementsDialogProps) {
    const [activeCategory, setActiveCategory] = useState<AchievementsCategoryData>();

    const categories = useAchievementCategories();

    if(!categories) {
        return null;
    }

    if(activeCategory) {
        return (
            <Dialog title="Achievements" hidden={hidden} onClose={onClose} width={400} height="auto" assumedHeight={350} initialPosition="center">
                <AchievementCategoryTab category={activeCategory} onClose={() => setActiveCategory(undefined)}/>
            </Dialog>
        );
    }
    
    return (
        <Dialog title="Achievements" hidden={hidden} onClose={onClose} width={400} height="auto" assumedHeight={350} initialPosition="center">
            <AchievementCategoriesTab categories={categories} onChange={setActiveCategory}/>
        </Dialog>
    );
}
