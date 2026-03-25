import { UserInterface } from '../../../../../../Logic/User/UserInterface';
import { useContext, useEffect, useState } from "react";
import Loading from '../../../Loading/Loading';
import Pagination from '../Pagination/HeaderPopUpPagination';
import { ThemeContext } from '../../../../ThemeProvider';
import HeaderPopUpFriendsUser from './HeaderPopUpFriendsUser';

type HeaderPopUpFriendsProps = {
    setActiveItem: (id: string | null) => void;
}

const HeaderPopUpFriends = ({setActiveItem}: HeaderPopUpFriendsProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [friends, setFriends] = useState<Array<UserInterface>>([]);
    const ITEMS_PER_PAGE = 5;
    const [page, setPage] = useState(1);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const currentFriends = friends.slice(start, end);
    const totalPages = Math.ceil(friends.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (!currentUser)
            return;

        fetch("/api/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: currentUser.id,
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error)
                    return console.error("(Error) Impossible to fetch friends:", result.error);

                setLoading(false);
                setFriends(result)
            })
            .catch((e) => {
                console.error("(Error) Impossible to fetch friends:", e)
            })
    }, []);

    return (
        <>
            {loading ? <Loading /> :
                <>
                    {friends.length === 0 ?
                        <div className='noData'>Your friends list is empty.</div>
                        :
                        <>
                            {currentFriends.map((user) => (
                                <HeaderPopUpFriendsUser user={user} setActiveItem={setActiveItem} />
                            ))}
                        </>
                    }

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

export default HeaderPopUpFriends;