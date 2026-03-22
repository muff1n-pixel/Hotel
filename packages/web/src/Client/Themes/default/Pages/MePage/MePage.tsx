import { useContext, useEffect, useRef, useState } from 'react';
import './MePage.css';
import { ThemeContext } from '../../ThemeProvider';
import { useNavigate } from 'react-router';
import ArticlesContainer from '../../Components/ArticleContainer/ArticleContainer';
import HotRooms from '../../Components/HotRooms/HotRooms';
import MyUser from '../../Components/Me/MyUser/MyUser';
import Box from '../../Components/Box/Box';

const MePage = () => {
    const navigate = useNavigate();

    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <div className='mePage resize'>
            <div className='grid'>
                <div className='grid_row'>
                    <MyUser />
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