import { useContext, useEffect, useRef, useState } from 'react';
import './MePage.css';
import { ThemeContext } from '../../ThemeProvider';
import { useNavigate } from 'react-router';
import ArticlesContainer from '../../Components/ArticleContainer/ArticleContainer';
import HotRooms from '../../Components/HotRooms/HotRooms';
import MyUser from '../../Components/Me/MyUser/MyUser';

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
                    <MyUser />

                    <div className='box'>
                        <div className='title'>Title Box</div>
                        <div className='content'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada. Morbi sapien nibh, placerat et tellus eget, vestibulum efficitur magna. Etiam est sem, congue sit amet egestas at, imperdiet ac ex. Pellentesque sit amet lectus ut nisl porttitor lobortis. Pellentesque sit amet pharetra erat. </div>
                    </div>
                </div>

                <div className='grid_row'>
                    <ArticlesContainer />

                    <HotRooms />
                </div>
            </div>
        </div>
    )
}

export default MePage;