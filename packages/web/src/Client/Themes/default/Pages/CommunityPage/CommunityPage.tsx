import './CommunityPage.css';
import Skeleton from '../../Images/community/habbo_skeleton.gif'
import NewsContainer from '../../Components/NewsContainer/NewsContainer';
import { useEffect, useState } from 'react';

type UserOnline = {
    id: string;
    name: string;
    motto: string;
}

const CommunityPage = () => {
    const [usersOnline, setUsersOnline] = useState<Array<UserOnline>>([]);

    useEffect(() => {
        fetch("/api/randomUsersOnline", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((result) => {
                setUsersOnline(result)
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch users online:", e)
            })
    }, [setUsersOnline]);

    return (
        <div className="communityPage resize">
            <div className='grid'>
                <div className='gridRow'>
                    <div className='box randomUsers'>
                        <div className='title lightBlue'>Random online users!</div>
                        <div className='onlines'>

                            {[...Array(18)].map((x, i) =>
                                <div className='row' style={usersOnline[i] && { backgroundImage: 'url("https://www.habbo.com/habbo-imaging/avatarimage?user=uik&direction=4&head_direction=4&action=&gesture=nrm&size=m")' }}>
                                    {usersOnline[i] &&
                                        <div className='info'>
                                            <div className='username'>{usersOnline[i].name}</div>
                                            <div className='motto'>{usersOnline[i].motto}</div>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='gridRow'>
                    <NewsContainer />
                </div>
            </div>
        </div>
    )
}

export default CommunityPage;