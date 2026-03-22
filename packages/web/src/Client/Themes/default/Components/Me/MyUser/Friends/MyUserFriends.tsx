import { useContext, useState } from "react";
import { ThemeContext } from "../../../../ThemeProvider";
import User from "../../../../../../Logic/User/User";
import { NavLink } from "react-router";

const MyUserFriends = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [showAll, setShowAll] = useState(false);

    const onlineFriends = currentUser ? currentUser.friends.filter(f => f.online) : [];
    const displayedFriends = showAll ? onlineFriends : onlineFriends.slice(0, 5);

    return (
        <p>
            {onlineFriends.length === 0 ? "You don't have any friends online." :
                <>
                    You have <b>{onlineFriends.length}</b> {onlineFriends.length > 1 ? "friends" : "friend"} online:{" "}
                    {displayedFriends.map((f, index) => (
                        <span key={f.name}>
                            <NavLink to={`/home/${f.name}`}>
                                {f.name}
                            </NavLink>
                            {index < displayedFriends.length - 1 && ", "}
                        </span>
                    ))}

                    {!showAll && onlineFriends.length > 5 && (
                        <>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setShowAll(true);
                            }}>
                                Show all
                            </a>
                        </>
                    )}
                </>
            }
        </p>
    );
}

export default MyUserFriends;