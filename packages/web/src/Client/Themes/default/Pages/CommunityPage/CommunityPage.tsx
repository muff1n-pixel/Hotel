import './CommunityPage.css';
import ArticlesContainer from '../../Components/ArticleContainer/ArticleContainer';
import { useEffect, useState } from 'react';
import CommunityUser from '../../Components/Community/CommunityUser';
import Box from '../../Components/Box/Box';

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
            },
            body: JSON.stringify({
                limit: 18,
            })
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
                    <Box title={'Random online users!'} className='randomUsers' color='lightBlue'>
                        <div className='onlines'>

                            {[...Array(18)].map((x, i) =>
                                <CommunityUser key={i} name={usersOnline[i]?.name} motto={usersOnline[i]?.motto} figureConfiguration={usersOnline[i]?.figureConfiguration} />
                            )}
                        </div>
                    </Box>
                </div>

                <div className='gridRow'>
                    <ArticlesContainer />
                </div>
            </div>
        </div>
    )
}

export default CommunityPage;