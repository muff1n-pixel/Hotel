import HeaderPopUpFriends from './Friends/HeaderPopUpFriends';
import HeaderPopUpGroups from './Groups/HeaderPopUpGroups';
import './HeaderPopUp.css'
import HeaderPopUpRooms from './Rooms/HeaderPopUpRooms';

type HomePopUpProps = {
    name: string;
    setActiveItem: (id: string | null) => void;
}

const HeaderPopUp = ({ name, setActiveItem }: HomePopUpProps) => {
    const renderByName = () => {
        switch(name) {
            case 'My Friends':
                return <HeaderPopUpFriends setActiveItem={setActiveItem} />

            case 'My Rooms':
                return <HeaderPopUpRooms />

            case 'My Groups':
                return <HeaderPopUpGroups />
        }
    }
    
    return (
        <div className='headerPopUpContent'>
            <div className='title'>{name}</div>

            <div className='data'>{renderByName()}</div>
        </div>
    );
}

export default HeaderPopUp;