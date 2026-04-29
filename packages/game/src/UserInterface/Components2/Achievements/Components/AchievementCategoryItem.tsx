import { AchievementsCategoryData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import "./AchievementCategoryItem.css";

export type AchievementCategoryItemProps = {
    category: AchievementsCategoryData;
    onClick?: () => void;
}

export default function AchievementCategoryItem({ category, onClick }: AchievementCategoryItemProps) {
    return (
        <div className="achievement-category-item" onClick={onClick}>
            <FlexLayout className="achievement-category-item-content" direction="column" justify="space-around" align="center" gap={5}>
                <b>{category.name}</b>

                <div style={{
                    position: "relative",

                    width: 68,
                    height: 64
                }}>
                    <div className="sprite_achievements_category_background" style={{
                        position: "absolute",
                        left: 0,
                        top: 0
                    }}/>

                    <div style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img src={`/assets/achievements/icons/${category.iconImage}`}/>
                    </div>
                    
                    <div className={(category.userUnlockedLevels)?("sprite_achievements_category_banner"):("sprite_achievements_category_banner_inactive")} style={{
                        position: "absolute",
                        left: 0,
                        top: 0
                    }}/>

                    <div style={{
                        position: "absolute",

                        top: 47,
                        left: 0,
                        width: "100%",

                        textAlign: "center",

                        color: "white",
                        fontFamily: "Ubuntu Bold",
                        fontSize: 12
                    }}>
                        {category.userUnlockedLevels}/{category.totalLevels}
                    </div>
                </div>
            </FlexLayout>
        </div>
    );
}