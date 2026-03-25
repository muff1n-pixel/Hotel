import { useState } from "react";
import { HomeUserType } from "../../../../../../Pages/HomePage/HomePage";
import HomeWidgetPagination from "../../Pagination/HomeWidgetPagination";
import RoomOpenIcon from '../../../../../../Images/icons/medium/room_icon_open.gif';
import goIcon from '../../../../../../Images/icons/medium/go_arrow.gif'
import './HomeWidgetRooms.css';

type HomeWidgetRoomsProps = {
    activeUser: HomeUserType,
    borderSkin: string | null
}

export const HomeWidgetRooms = ({ activeUser, borderSkin }: HomeWidgetRoomsProps) => {
    const ITEMS_PER_PAGE = 4;
    const [page, setPage] = useState(1);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const showingRooms = activeUser.rooms.slice(start, end);
    const totalPages = Math.ceil(activeUser.rooms.length / ITEMS_PER_PAGE);

    return (
        <div className={`roomsWidget widget skin ${borderSkin}`}>
            <div className="widgetCorner">
                <div className="widgetHeadline">
                    <div className='widgetTitle'>My Rooms ({activeUser.rooms.length})</div>
                </div>
            </div>

            <div className="widgetBody">
                <div className="widgetContent">
                    {activeUser.rooms.length === 0 ?
                        <div className="noRooms">No rooms yet.</div>
                        :
                        <div className="rooms">

                            {
                                showingRooms.map((room) => {
                                    return (
                                        <div className="row" onClick={() => window.open(`/game?room=${room.id}`, "_blank", "noopener,noreferrer")} key={room.id}>
                                            <img src={RoomOpenIcon} alt="Room" className="icon" />

                                            <div className="data">
                                                <div className="name">{room.name}</div>
                                                <div className="users">{room.currentUsers}/{room.maxUsers}</div>
                                            </div>

                                            <img src={goIcon} alt="goIcon" className="joinRoom" />
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

export default HomeWidgetRooms;