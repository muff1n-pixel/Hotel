import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../ThemeProvider";
import friendsIcon from '../../Images/settings/friends.gif';
import addIcon from '../../Images/settings/add.gif';
import friendsFollowIcon from '../../Images/settings/friends_follow.gif';
import { Alert, AlertType } from "./Alert";


const SettingsFriendsForm = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    if (!currentUser)
        return (
            <div className='box'>
                <div className='alert error noMargin'>Please reconnect on the website.</div>
            </div>);
    else {
        const [alert, setAlert] = useState<null | Alert>(null);

        const [allowFriendsRequest, setAllowFriendsRequest] = useState(currentUser.preferences.allowFriendsRequest)
        const [allowFriendsFollow, setAllowFriendsFollow] = useState(currentUser.preferences.allowFriendsFollow);

        const submitForm = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            fetch("/api/settings/friends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    allowFriendsRequest,
                    allowFriendsFollow
                })
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.error)
                        return setAlert({
                            type: AlertType.ERROR,
                            message: result.error
                        });

                    const newUser = Object.create(
                        Object.getPrototypeOf(currentUser),
                        Object.getOwnPropertyDescriptors(currentUser)
                    );

                    newUser.allow_friends_request = allowFriendsRequest;
                    newUser.allow_friends_follow = allowFriendsFollow;

                    dispatch({ currentUser: newUser });
                    setAlert({
                        type: AlertType.SUCCESS,
                        message: result.success
                    });

                });
        }, [allowFriendsRequest, allowFriendsFollow]);

        return (
            <div className="box">
                <div className="title">Edit my friends settings</div>
                {alert && <div className={`alert ${alert.type === AlertType.SUCCESS ? "success" : "error"}`}>{alert.message}</div>}
                <form onSubmit={submitForm}>
                    <div className="row">
                        <span><img src={addIcon} alt="Add icon" /> Accept friends request</span>
                        <select value={Number(allowFriendsRequest)} onChange={(e) => setAllowFriendsRequest(e.target.value === "1") }>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <div className="row">
                        <span><img src={friendsFollowIcon} alt="Friends follow icon" /> Allow friends follow</span>
                        <select value={Number(allowFriendsFollow)} onChange={(e) => setAllowFriendsFollow(e.target.value === "1") }>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <button><img src={friendsIcon} alt="Friends Icon" /> Edit my friends settings</button>
                </form>
            </div>
        )
    }
}

export default SettingsFriendsForm;