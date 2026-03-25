import { useState } from "react";
import { HomeUserType } from "../../../../../../Pages/HomePage/HomePage";
import HomeWidgetPagination from "../../Pagination/HomeWidgetPagination";
import './HomeWidgetBadges.css';

type HomeWidgetBadgesProps = {
    activeUser: HomeUserType,
    borderSkin: string | null
}

export const HomeWidgetBadges = ({ activeUser, borderSkin }: HomeWidgetBadgesProps) => {
    const ITEMS_PER_PAGE = 20;
    const [page, setPage] = useState(1);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const showingBadges = activeUser.badges.slice(start, end);
    const totalPages = Math.ceil(activeUser.badges.length / ITEMS_PER_PAGE);

    return (
        <div className={`badgesWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'>Badges & Achievements</div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    {activeUser.badges.length === 0 ?
                        <div className="noBadges">No badges yet.</div>
                        :
                        <div className="badges">

                            {
                                showingBadges.map((badge) => {
                                    return (
                                        <div className="row" key={badge}>
                                            <img src={`/assets/badges/${badge}`} alt={badge} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }

                    {totalPages > 1 &&
                        <HomeWidgetPagination
                            page={page}
                            totalPages={totalPages}
                            onPrev={() => setPage(page - 1)}
                            onNext={() => setPage(page + 1)}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default HomeWidgetBadges;