import { useState } from "react";
import { HomeUserType } from "../../../../../../Pages/HomePage/HomePage";
import HomeWidgetPagination from "../../Pagination/HomeWidgetPagination";
import './HomeWidgetFriends.css';
import { useNavigate } from "react-router";
import HomeWidgetFriend from "./Friend/HomeWidgetFriend";

type HomeWidgetFriendsProps = {
    activeUser: HomeUserType,
    borderSkin: string | null
}

export const HomeWidgetFriends = ({ activeUser, borderSkin }: HomeWidgetFriendsProps) => {
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 4;
    const [page, setPage] = useState(1);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const showingFriends = activeUser.friends.slice(start, end);
    const totalPages = Math.ceil(activeUser.friends.length / ITEMS_PER_PAGE);

    return (
        <div className={`friendsWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'>My Friends ({activeUser.friends.length})</div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    {activeUser.friends.length === 0 ?
                        <div className="noFriends">No friends yet.</div>
                        :
                        <div className="friends">

                            {
                                showingFriends.map((friend) => {
                                    return (
                                        <HomeWidgetFriend {...friend} key={friend.id} />
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

export default HomeWidgetFriends;