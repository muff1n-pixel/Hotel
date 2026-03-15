import './StaffPage.css';
import Leaders_Image from '../../Images/staff/leaders.png';
import Admin_Badge from '../../Images/staff/ADM.gif';
import Frank_Search from '../../Images/frank/frank_search.gif'
import StaffUser from '../../Components/Staff/StaffUser';

const StaffPage = () => {
    let figureConfig = {
        "gender": "male",
        "parts": [
            {
                "type": "hd",
                "setId": "180",
                "colors": [
                    2
                ]
            },
            {
                "type": "hr",
                "setId": "828",
                "colors": [
                    31
                ]
            },
            {
                "type": "ea",
                "setId": "3196",
                "colors": [
                    62
                ]
            },
            {
                "type": "ch",
                "setId": "255",
                "colors": [
                    1415
                ]
            },
            {
                "type": "lg",
                "setId": "3216",
                "colors": [
                    110
                ]
            },
            {
                "type": "sh",
                "setId": "305",
                "colors": [
                    62
                ]
            }
        ]
    }

    return (
        <div className="staffPage resize">
            <div className='grid'>
                <div className='grid_row'>
                    <div className='box'>
                        <div className='title flex'>Administratation <span>Developers, Administrators</span></div>
                        <div className='content'>
                            <StaffUser id="userId" name="MyUsername" role="Developer" motto="This is my motto!" online={true} figureConfiguration={figureConfig} currentBadges={["ADM", "01GOTW", "14XR5", "20TH", "15H06"]} />

                            <StaffUser id="userId" name="ItsMe" role="Administrator" motto="Wuuuut!" online={false} figureConfiguration={figureConfig} currentBadges={["ACH_BaseJumpMissile4", "ACH_BattleBallPlayer2", "ACH_CrystalCracker1", "ADM", "01GOTW"]} />
                        </div>
                    </div>

                    <div className='box'>
                        <div className='title flex'>Moderation <span>Moderators, Coordinators</span></div>
                        <div className='content'>
                            <StaffUser id="userId" name="ItsMe" role="Moderator" motto="Hey!!!" online={false} figureConfiguration={figureConfig} currentBadges={["UK902", "ADM", "UK862", "UK969", "UK970"]} />
                        </div>
                    </div>
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