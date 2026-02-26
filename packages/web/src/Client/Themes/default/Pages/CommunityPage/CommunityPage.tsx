import './CommunityPage.css';
import NewsContainer from '../../Components/NewsContainer/NewsContainer';
import { useEffect, useState } from 'react';
import CommunityUser from '../../Components/Community/CommunityUser';

type UserOnline = {
    id: string;
    name: string;
    motto: string;
    figureConfiguration: string;
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
                                <CommunityUser key={i} name={usersOnline[i]?.name} motto={usersOnline[i]?.motto} figureConfiguration={usersOnline[i]?.figureConfiguration} />
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