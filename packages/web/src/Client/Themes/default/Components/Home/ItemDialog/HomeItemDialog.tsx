import { useEffect, useRef, useState } from 'react';
import { HomeItemType, HomeType } from '../../../Pages/HomePage/HomePage';
import './HomeItemDialog.css'; import HomeItemDialogContent from './DialogContent/HomeItemDialogContent';
import animatedArrow from '../../../Images/icons/small/animated_arrow.gif'

export enum HomeItemDialogTab {
    Inventory,
    WebStore
}

type HomeItemDialogProps = {
    playgroundRef: React.RefObject<HTMLDivElement | null>,
    defaultTab?: HomeItemDialogTab,
    homeType: HomeType,
    setHomeItems: React.Dispatch<React.SetStateAction<HomeItemType[]>>,
    onClose: () => void
}

const HomeItemDialog = ({ playgroundRef, defaultTab, homeType, setHomeItems, onClose }: HomeItemDialogProps) => {
    const tabs = [
        { label: "Inventory", value: HomeItemDialogTab.Inventory },
        { label: "Web Store", value: HomeItemDialogTab.WebStore },
    ]

    const [newItems, setNewItems] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<HomeItemDialogTab>(defaultTab ? defaultTab : HomeItemDialogTab.Inventory);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const previousBackgroundRef = useRef<string | null>(null);
    const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setPreview = (url: string | null) => {
        const playgroundEl = playgroundRef.current;
        const dialogEl = dialogRef.current;

        if (!playgroundEl || !dialogEl) return;

        if (url === null) {
            if (previewTimeoutRef.current) {
                clearTimeout(previewTimeoutRef.current);
                previewTimeoutRef.current = null;
            }

            if (previousBackgroundRef.current !== null) {
                playgroundEl.style.backgroundImage = previousBackgroundRef.current;
                previousBackgroundRef.current = null;
            }

            dialogEl.classList.remove("preview");
            return;
        }

        if (!previousBackgroundRef.current) {
            previousBackgroundRef.current = playgroundEl.style.backgroundImage;
        }

        playgroundEl.style.backgroundImage = `url('/assets/home/${url}')`;
        dialogEl.classList.add("preview");

        if (previewTimeoutRef.current) {
            clearTimeout(previewTimeoutRef.current);
        }

        previewTimeoutRef.current = setTimeout(() => {
            dialogEl.classList.remove("preview");

            if (previousBackgroundRef.current !== null) {
                playgroundEl.style.backgroundImage = previousBackgroundRef.current;
                previousBackgroundRef.current = null;
            }

            previewTimeoutRef.current = null;
        }, 5000);
    };

    useEffect(() => {
        return () => {
            if (previewTimeoutRef.current) {
                clearTimeout(previewTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (activeTab === HomeItemDialogTab.Inventory)
            setNewItems(0);

    }, [activeTab]);

    const closeModal = () => {
        setPreview(null);
        onClose();
    }

    return (
        <div className="homeItemDialog" ref={dialogRef}>
            <div className='dialog'>
                <div className='dialogHeader'>
                    <ul>
                        {tabs.map(tab => (
                            <li
                                key={tab.value}
                                className={activeTab === tab.value ? 'active' : ''}
                                onClick={() => setActiveTab(tab.value)}
                            >
                                {tab.label} {(tab.label === 'Inventory' && newItems > 0) && <div className='new_items'><img src={animatedArrow} alt="Animated Arrow" /> ({newItems})</div>}
                            </li>
                        ))}
                    </ul>

                    <div className='close_button' onClick={closeModal}></div>
                </div>

                <HomeItemDialogContent setHomeItems={setHomeItems} setBgPreview={setPreview} homeType={homeType} activeTab={activeTab} setNewItems={setNewItems} />
            </div>
        </div>
    )
}

export default HomeItemDialog;