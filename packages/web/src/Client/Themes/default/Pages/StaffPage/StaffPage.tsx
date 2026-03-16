import './StaffPage.css';
import Leaders_Image from '../../Images/staff/leaders.png';
import Admin_Badge from '../../Images/staff/ADM.gif';
import Frank_Search from '../../Images/frank/frank_search.gif'
import StaffUser from '../../Components/Staff/StaffUser/StaffUser';
import { useEffect, useState } from 'react';
import Loading from '../../Components/Loading/Loading';
import StaffSection, { StaffRankType } from '../../Components/Staff/StaffSection';

const StaffPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [ranks, setRanks] = useState<Array<StaffRankType>>([])

    useEffect(() => {
        fetch("/api/ranks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            })
        })
            .then((response) => response.json())
            .then((result) => {
                setRanks(result);
                setLoading(false);
            })
            .catch((e) => {
                console.log("(Error) Impossible to fetch staff sections:", e)
            })
    }, [])

    return (
        <div className="staffPage resize">
            <div className='grid'>
                <div className='grid_row'>
                    {
                        loading ?
                            <Loading />
                            :
                            <div>
                                {ranks.map((rank) => {
                                    return (
                                        <StaffSection {...rank} key={rank.id} />
                                    )
                                })}
                            </div>
                    }
                </div>

                <div className='grid_row'>
                    <div className='box'>
                        <div className='title red'>Hotel Leaders</div>
                        <div className='content'>
                            <img src={Leaders_Image} alt="Leaders" className='float_right' />
                            You can contact a <b>Hotel Leader</b> throught the help-tool. A staff member will get back to you as soon as possible. If it's urgent and require attention, you may also use the <b>Call For Help</b> system in game.
                        </div>
                    </div>

                    <div className='box'>
                        <div className='title red'>Hotel Moderation Team</div>
                        <div className='content'>
                            <img src={Admin_Badge} alt="Staff Badge" className='float_right' />

                            The primary role of the <b>Hotel Moderation Team</b> is to deal with the safety and enjoyment of players. Situations involving possible child luring or predatory behaviour, the dangerous exchange of personal information, sexual harassment and bullying are a <b>Hotel Moderation</b> team member's highest priority and should always be addressed before all other reports.
                        </div>
                    </div>

                    <div className='box'>
                        <div className='title green'>Does Pixel need staff?</div>
                        <div className='content'>
                            <img src={Frank_Search} alt="Frank Search" className='float_left' />

                            Seeking to join the Pixel Team? We're continually looking for fresh talent! Our ideal candidates are those who are <b>active and have established a notible presence within our community</b>. While we cherish long-standing members, we're open to anyone who shares our passion. Contact with us on <a href="/discord" target='_blank'>Discord</a> to explore opportunities.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffPage;