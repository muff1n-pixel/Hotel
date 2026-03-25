import { useContext, useEffect, useRef, useState } from 'react';
import './HomePage.css'
import Loading from '../../Components/Loading/Loading';
import Button from '../../Components/Button/Button';
import EditIcon from '../../Images/icons/small/tools_edit_white.gif'
import CheckIcon from '../../Images/icons/small/check.gif'
import HomePlayground from '../../Components/Home/HomePlayground';
import HomeItemDialog, { HomeItemDialogTab } from '../../Components/Home/ItemDialog/HomeItemDialog';
import InventoryIcon from '../../Images/icons/small/home_inventory.gif';
import PurchaseIcon from '../../Images/icons/small/purchase.gif'
import { useNavigate, useParams } from 'react-router';
import { ThemeContext } from '../../ThemeProvider'
import { RoomInterface } from '../../../../Logic/Room/RoomInterface';

export enum HomeType {
    User,
    Group
}

export type HomeItemType = {
    id: string,
    positionX: number | null,
    positionY: number | null,
    data: string | null,
    borderSkin: string | null,
    itemId: string,
    itemCredits: number,
    itemDuckets: number,
    itemDiamonds: number,
    itemPage: string | null,
    itemTitle: string,
    itemDescription: string | null,
    itemType: 'widgets' | 'backgrounds' | 'stickers' | 'notes',
    itemImage: string,
    itemWidth: number,
    itemHeight: number
}

export type HomeOtherUserType = {
    id: string,
    name: string,
    motto: string,
    figureConfiguration: object,
    online: string
}

export type GuestbookMessage = {
    id: string,
    message: string,
    date: Date,
    user: HomeOtherUserType
}

export type HomeUserType = {
    id: string;
    name: string;
    motto: string;
    figureConfiguration: any;
    online: boolean;
    registered: Date;
    lastLogin: Date | null;
    badges: Array<string>;
    currentBadges: Array<string>;
    rooms: Array<RoomInterface>;
    friends: Array<HomeOtherUserType>;
    guestbookMessages: Array<GuestbookMessage>
}

export type HomeLastModalOpenType = {
    inventory: {
        tab: HomeItemDialogTab | null,
        category: {
            id: string;
        } | null,
        sub: {
            id: string;
        } | null;
    },
    webshop: {
        tab: HomeItemDialogTab | null,
        category: {
            id: string;
        } | null,
        sub: {
            id: string;
        } | null;
    }
}

const HomePage = () => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [activeUser, setActiveUser] = useState<HomeUserType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dialogDefaultTab, setDialogDefaultTab] = useState(HomeItemDialogTab.Inventory);
    const [dialogItemOpen, setDialogItemOpen] = useState(false);
    const parentRef = useRef<HTMLDivElement | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [homeItems, setHomeItems] = useState<HomeItemType[]>([]);
    const [lastModalOpen, setLastModalOpen] = useState<HomeLastModalOpenType>({
        inventory: {
            tab: null,
            category: null,
            sub: null
        },
        webshop: {
            tab: null,
            category: null,
            sub: null
        }
    });
    const { name } = useParams();
    const navigate = useNavigate();
    const inventoryRef = useRef<HTMLButtonElement | null>(null);

    const openDialog = (tab: HomeItemDialogTab) => {
        setDialogDefaultTab(tab);
        setDialogItemOpen(true);
    }

    useEffect(() => {
        if (!name) {
            navigate('/community');
            return
        }

        if (dialogItemOpen)
            setDialogItemOpen(false);

        if (!loading)
            setLoading(true);

        if (editMode)
            setEditMode(false);

        fetch("/api/home", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    navigate('/community');
                    return
                }

                setActiveUser(result.user);
                setHomeItems(result.items);
                setLoading(false);
            })
            .catch((e) => {
                console.error("(Error) Impossible to get home:", e)
            })
    }, [name]);

    const openDialogModal = (tab: HomeItemDialogTab) => {
        openDialog(tab);
    }

    return (
        <div className='homePage resize homeResize'>
            {
                loading || !activeUser ?
                    <Loading />
                    :
                    <div className='container'>
                        <div className='header'>
                            {currentUser && currentUser.name === activeUser.name &&
                                <>
                                    {!editMode ?
                                        <Button color='black' onClick={() => setEditMode(true)}><img src={EditIcon} alt='Edit Icon' />Edit</Button>
                                        :
                                        <Button color='green' onClick={() => setEditMode(false)}><img src={CheckIcon} alt='Check Icon' />End edit</Button>
                                    }
                                </>
                            }
                            <div className='name'>{activeUser.name}</div>

                            {currentUser && currentUser.name === name && editMode &&
                                <div className='dialogButtons'>
                                    <Button ref={inventoryRef} color='grey' onClick={() => openDialogModal(HomeItemDialogTab.Inventory)}><img src={InventoryIcon} alt='Inventory Icon' />Inventory</Button>
                                    <Button color='black' onClick={() => openDialogModal(HomeItemDialogTab.WebStore)}><img src={PurchaseIcon} alt='Purchase Icon' />Store</Button>
                                </div>
                            }
                        </div>

                        {editMode && dialogItemOpen && <HomeItemDialog playgroundRef={parentRef} defaultTab={dialogDefaultTab} setHomeItems={setHomeItems} lastModalOpen={lastModalOpen} setLastModalOpen={setLastModalOpen} homeType={HomeType.User} onClose={() => setDialogItemOpen(false)} />}
                        <HomePlayground
                            playgroundRef={parentRef}
                            items={homeItems}
                            homeType={HomeType.User}
                            editMode={editMode}
                            setItems={setHomeItems}
                            inventoryRef={inventoryRef}
                            activeUser={activeUser}
                        />
                    </div>
            }
        </div>
    )
}

export default HomePage;