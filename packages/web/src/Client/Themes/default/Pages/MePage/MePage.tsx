import { useContext, useEffect } from 'react';
import './MePage.css';
import { ThemeContext } from '../../ThemeProvider';
import { useLocation, useNavigate } from 'react-router';
import Button from '../../Components/Button';
import creditIcon from '../../Images/me/creditIcon.png'
import ducketsIcon from '../../Images/me/duckets.png';
import keyIcon from '../../Images/me/key.gif'
import clockIcon from '../../Images/me/clock.gif'
import discordIcon from '../../Images/me/discord.png'
import diamondsIcon from '../../Images/me/diamonds.png'
import NewsContainer from '../../Components/NewsContainer/NewsContainer';

const MePage = () => {
    const navigate = useNavigate();

    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <div className='me_page resize'>
            <div className='grid'>
                <div className='grid_row'>
                    <div className='my_user'>
                        <div className='hotel_view'>
                            <div className='enter_button'>
                                <div className='bg'></div>
                                <Button color='green' size='medium' onClick={() => window.location.href = "/game"}>Enter Hotel <div className='arrow'></div></Button>
                            </div>
                        </div>
                        <div className='my_data'>
                            <div className='my_avatar'>
                                <div className='avatar'>
                                    <img src='https://www.habbo.com/habbo-imaging/avatarimage?user=uik&direction=2&head_direction=2&action=&gesture=nrm&size=m' alt="Avatar" />
                                </div>

                                <div className='motto'><span>{currentUser?.name}: </span> {currentUser?.motto}</div>
                            </div>

                            <div className='bank'>
                                <div className='row'><img src={creditIcon} alt="Credits Icon" /> <span>{currentUser?.credits}</span> Credits</div>
                                <div className='row'><img src={ducketsIcon} alt="Duckets Icon" /> <span>{currentUser?.duckets}</span> Duckets</div>
                                <div className='row'><img src={diamondsIcon} alt="Diamonds Icon" /> <span>{currentUser?.diamonds}</span> Diamonds</div>
                            </div>
                        </div>

                        <div className='row'>
                            <img src={keyIcon} alt="Key Icon" />
                            <div className='description'>
                                <h2>Hey {currentUser?.name}, safety first!</h2>
                                <p>Do not share any of your personal data with anyone on our game, you never know who you might encounter!</p>
                            </div>
                        </div>
                        <div className='row'>
                            <img src={discordIcon} alt="Discord Icon" />
                            <div className='description'>
                                <h2>Join our community!</h2>
                                <p>Be part of the adventure and join us by clicking <a href="/discord" target='_blank'>here</a>!</p>
                            </div>
                        </div>
                        <div className='row small'>
                            <img src={clockIcon} alt="Clock Icon" />
                            <div className='description'>
                                <p>Last signed in: XXX</p>
                            </div>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='title'>Title Box</div>
                        <div className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada. Morbi sapien nibh, placerat et tellus eget, vestibulum efficitur magna. Etiam est sem, congue sit amet egestas at, imperdiet ac ex. Pellentesque sit amet lectus ut nisl porttitor lobortis. Pellentesque sit amet pharetra erat. </div>
                    </div>
                </div>

                <div className='grid_row'>
                    <NewsContainer />

                    <div className='box'>
                        <div className='title red'>Title Box</div>
                        <div className='content'>Nunc ut arcu ac tellus iaculis placerat. Praesent bibendum felis eget elementum tincidunt. Nullam sit amet suscipit mi. Nulla quis auctor metus. Aliquam rhoncus non diam quis feugiat. Pellentesque a elit sed ante dignissim eleifend sit amet nec risus. Maecenas sapien urna, feugiat eget laoreet et, gravida lacinia mauris.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MePage;