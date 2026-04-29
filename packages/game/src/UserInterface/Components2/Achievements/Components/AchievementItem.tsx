import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import "./AchievementItem.css";
import { AchievementData } from "@pixel63/events";

export type AchievementItemProps = {
    achievement: AchievementData;
    
    active: boolean;
    onClick?: () => void;
}

export default function AchievementItem({ achievement, active, onClick }: AchievementItemProps) {
    return (
        <div className={`achievement-item ${(active)?("achievement-item-active"):("")}`} onClick={onClick}>
            <div className="achievement-item-border">
                <div className="achievement-item-content">
                    {(!achievement.currentBadge)?(
                        <div className="sprite_question" style={{
                            filter: "grayscale(100%)"
                        }}/>
                    ):(
                        <BadgeImage badge={achievement.currentBadge}/>
                    )}
                </div>
            </div>
        </div>
    );
}