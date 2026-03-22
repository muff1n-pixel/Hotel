import { RoomInterface } from '../../../../../../Logic/Room/RoomInterface';
import { useContext, useEffect, useState } from "react";
import Loading from '../../../Loading/Loading';
import Pagination from '../Pagination/HeaderPopUpPagination';
import { ThemeContext } from '../../../../ThemeProvider';
import goIcon from '../../../../Images/icons/medium/arrow_right.gif'

const HeaderPopUpRooms = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [rooms, setRooms] = useState<Array<RoomInterface>>([]);
    const ITEMS_PER_PAGE = 5;
    const [page, setPage] = useState(1);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const currentRooms = rooms.slice(start, end);
    const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (!currentUser)
            return;

        fetch("/api/rooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ownerId: currentUser.id,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error)
                    return console.error("(Error) Impossible to fetch rooms:", result.error);

                setLoading(false);
                setRooms(result)
            })
            .catch((e) => {
                console.error("(Error) Impossible to fetch rooms:", e)
            })
    }, []);

    return (
        <>
            {loading ? <Loading /> :
                <>
                    {currentRooms.map((room) => (
                        <div className="row room" key={room.id} onClick={() => window.open(`/game?room=${room.id}`, "_blank", "noopener,noreferrer")}>
                            <span>{room.name}</span>
                            <img src={goIcon} alt="goIcon" className="joinRoom" />
                        </div>
                    ))}

                    {totalPages > 1 &&
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPrev={() => setPage(page - 1)}
                            onNext={() => setPage(page + 1)}
                        />
                    }
                </>
            }
        </>
    );
}

export default HeaderPopUpRooms;