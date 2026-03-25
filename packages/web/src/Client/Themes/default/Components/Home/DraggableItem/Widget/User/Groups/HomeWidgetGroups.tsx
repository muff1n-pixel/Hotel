import { HomeUserType } from "../../../../../../Pages/HomePage/HomePage";
import './HomeWidgetGroups.css';

type HomeWidgetGroupsProps = {
    activeUser: HomeUserType,
    borderSkin: string | null
}

export const HomeWidgetGroups = ({ activeUser, borderSkin }: HomeWidgetGroupsProps) => {
    return (
        <div className={`groupsWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'>My Groups</div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    <div className="noBadges">No available yet.</div>
                </div>
            </div>
        </div>
    )
}

export default HomeWidgetGroups;