import { HomeItemType, HomeType, HomeLastModalOpenType } from '../../../../Pages/HomePage/HomePage';
import creditsIcon from '../../../../Images/me/creditIcon.png';
import ducketsIcon from '../../../../Images/me/duckets.png';
import diamondsIcon from '../../../../Images/me/diamonds.png';
import { act, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../../../../ThemeProvider';
import HomeItemDialogCategories from '../CategoriesSlider/HomeItemDialogCategories';
import { HomeItemDialogTab } from '../HomeItemDialog';
import Loading from '../../../Loading/Loading';
import Button from '../../../Button/Button';
import Box from '../../../Box/Box';

type HomeItemDialogProps = {
    lastModalOpen: HomeLastModalOpenType,
    homeType: HomeType,
    activeTab: HomeItemDialogTab,
    setLastModalOpen: (data: HomeLastModalOpenType) => void,
    setHomeItems: React.Dispatch<React.SetStateAction<HomeItemType[]>>,
    setBgPreview: (url: string | null) => void;
    setNewItems: (number) => void
}

const HomeItemDialogContent = ({ lastModalOpen, homeType, activeTab, setHomeItems, setBgPreview, setNewItems, setLastModalOpen }: HomeItemDialogProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);
    const [loadItems, setLoadItems] = useState<boolean>(false);
    const [inventory, setInventory] = useState<HomeItemType[]>([]);
    const [items, setItems] = useState<HomeItemType[]>([]);
    const [activeItem, setActiveItem] = useState<HomeItemType | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [notesDialog, setNotesDialog] = useState<boolean>(false);
    const [noteContent, setNoteContent] = useState<string>('');

    useEffect(() => {
        setError(null);
        setItems([]);
        setAmount(null);
        setActiveItem(null);
        setLoadItems(false);
    }, [activeTab]);

    const placeItem = useCallback(() => {
        if (!activeItem || activeTab !== HomeItemDialogTab.Inventory)
            return;

        if (activeItem.itemType === 'notes' && !notesDialog) {
            setNotesDialog(true);
            return;
        }

        fetch("/api/home/place", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                homeType: homeType === HomeType.User ? 'user' : 'group',
                itemId: activeItem.id,
                noteData: noteContent
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    setError(result.error);
                    return;
                }

                setError(null);

                if (notesDialog) {
                    setNoteContent('');
                    setNotesDialog(false);
                }

                const hasBackground = result.placedItem.some(
                    item => item.itemType === "backgrounds"
                );

                if (hasBackground) {
                    setBgPreview(null);
                }

                setHomeItems(prevItems => {
                    const removedIds = new Set(result.removedItem.map(item => item.id));

                    const filteredItems = prevItems.filter(
                        item => !removedIds.has(item.id)
                    );

                    return [...filteredItems, ...result.placedItem];
                });

                setInventory(prevItems => {
                    const placedIds = new Set(result.placedItem.map(item => item.id));

                    const filtered = prevItems.filter(
                        item => !placedIds.has(item.id)
                    );

                    return [...filtered, ...result.removedItem];
                });

                setItems(prevItems => {
                    const placedIds = new Set(result.placedItem.map(item => item.id));

                    const filtered = prevItems.filter(
                        item => !placedIds.has(item.id)
                    );

                    const sameCategoryItems = filtered.length > 0
                        ? result.removedItem.filter(item => item.itemPage === filtered[0].itemPage)
                        : [];

                    const newItems = [...filtered, ...sameCategoryItems];

                    setActiveItem(prev => {
                        if (!newItems.length) return null;

                        const index = newItems.findIndex(i => i.itemId === prev?.itemId);

                        if (index !== -1) return newItems[index];

                        return newItems[0];
                    });

                    return newItems;
                });
            })
            .catch((e) => {
                setError('An error occured.');
                console.error("(Error) Impossible to place item:", e)
            })

    }, [activeItem, activeTab, notesDialog, noteContent]);

    const buyItem = useCallback(() => {
        if (!activeItem || activeTab !== HomeItemDialogTab.WebStore)
            return;

        fetch("/api/home/shop/buy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                homeType: homeType === HomeType.User ? 'user' : 'group',
                itemId: activeItem.id,
                amount: amount
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    setError(result.error);
                    return;
                } else if (result.success) {
                    const newUser = Object.create(
                        Object.getPrototypeOf(currentUser),
                        Object.getOwnPropertyDescriptors(currentUser)
                    );

                    newUser.credits = result.success.newBalance.credits;
                    newUser.duckets = result.success.newBalance.duckets;
                    newUser.diamonds = result.success.newBalance.diamonds;

                    dispatch({ currentUser: newUser });
                    setNewItems(prev => prev + result.success.amount);
                    setLastModalOpen({
                        ...lastModalOpen,
                        inventory: {
                            ...lastModalOpen.webshop
                        }
                    });
                }
            })
            .catch((e) => {
                setError('An error occured.');
                console.error("(Error) Impossible to get items:", e)
            })

    }, [activeItem, activeTab, amount]);

    const displayItems = useMemo(() => {
        if (activeTab === HomeItemDialogTab.Inventory) {
            return Object.values(
                items.reduce((acc, item) => {
                    const key = item.itemId;

                    if (!acc[key]) {
                        acc[key] = { item, count: 1 };
                    } else {
                        acc[key].count++;
                    }

                    return acc;
                }, {} as Record<string, { item: typeof items[number], count: number }>)
            );
        }

        return items.map(item => ({ item, count: 1 }));
    }, [items, activeTab]);


    return (
        <div className='dialogContainer'>
            {notesDialog &&
                <div className='notesDialog'>
                    <Box color='orange' title={'Place new note'}>
                        {error && <div className='error'>{error}</div>}
                        <textarea placeholder='Your note...' maxLength={500} onChange={(e) => setNoteContent(e.target.value)} />
                        <Button color='grey' onClick={() => placeItem()}>Add my note {noteContent.length > 0 && `(${noteContent.length}/500)`}</Button>
                        <Button color='red' onClick={() => {
                            setNoteContent('');
                            setNotesDialog(false);
                            setError(null);
                        }}>Close</Button>
                    </Box>
                </div>
            }

            {!notesDialog && error && <div className='error'>{error}</div>}

            <div className='dialogContent'>
                {currentUser ?
                    <>
                        <HomeItemDialogCategories
                            lastModalOpen={lastModalOpen}
                            homeType={homeType}
                            activeTab={activeTab}
                            inventory={inventory}
                            onItemsLoaded={(items) => {
                                setLoadItems(false);

                                setItems(items);
                                setActiveItem(items[0]);

                            }}
                            setLastModalOpen={setLastModalOpen}
                            setLoadItems={setLoadItems}
                            setInventory={setInventory}
                            onCategoryChange={(category) => setActiveCategory(category)}
                        />

                        <div>
                            <div className='label'>Select an item by clicking</div>

                            {loadItems ?
                                <Loading style={{
                                    flex: 1
                                }} />
                                :
                                <ul className={`items ${activeCategory === 'widgets' ? 'full' : ''}`}>
                                    {Array.from({ length: Math.max(activeCategory === 'widgets' ? 5 : 20, displayItems.length) }).map((_, index) => {
                                        const data = displayItems[index];
                                        const item = data?.item;
                                        const count = data?.count;

                                        return (
                                            <li
                                                key={index}
                                                className={[
                                                    !item ? "disabled" : "",
                                                    item && activeItem?.id === item.id ? "active" : ""
                                                ].join(" ")}
                                                style={
                                                    item
                                                        ? {
                                                            backgroundImage: `url(/assets/home/${item.itemType}/${item.itemImage})`,
                                                        }
                                                        : undefined
                                                }
                                                onClick={() => {
                                                    if (!item) return;
                                                    setActiveItem(item);
                                                    setAmount(null);
                                                }}
                                            >
                                                {activeCategory === 'widgets' &&
                                                    <>
                                                        <div className='name'>{item && item.itemTitle}</div>
                                                        <div className='description'>{item && item.itemDescription}</div>
                                                    </>
                                                }
                                                {count > 1 && (
                                                    <div className="amount">{count}</div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            }
                        </div>

                        <div className='preview'>
                            <div className='previewBox'>
                                <div className={`previewItem ${activeItem?.itemType ?? ""}`} style={
                                    activeItem
                                        ? {
                                            backgroundImage: `url(/assets/home/${activeItem.itemType}/${activeItem.itemImage})`,
                                        }
                                        : undefined
                                }>
                                    {(activeTab === HomeItemDialogTab.WebStore && activeItem && activeItem.itemType === "backgrounds") && <button className='preview' onClick={() => setBgPreview(`${activeItem.itemType}/${activeItem.itemImage}`)}>Preview</button>}
                                    {(amount && amount > 1) && <div className='amount'>x{amount}</div>}
                                </div>
                            </div>
                            {activeTab === HomeItemDialogTab.WebStore && activeItem &&
                                <>
                                    <div className='price'>
                                        {
                                            activeItem.itemCredits === 0 && activeItem.itemDuckets === 0 && activeItem.itemDiamonds === 0 ?
                                                <div className='row'>Free!</div>
                                                :
                                                <>
                                                    {activeItem.itemCredits > 0 && <div className='row'><img src={creditsIcon} alt="Credits Icon" /> {amount ? amount * activeItem.itemCredits : activeItem.itemCredits}</div>}
                                                    {activeItem.itemDuckets > 0 && <div className='row'><img src={ducketsIcon} alt="Duckets Icon" /> {amount ? amount * activeItem.itemDuckets : activeItem.itemDuckets}</div>}
                                                    {activeItem.itemDiamonds > 0 && <div className='row'><img src={diamondsIcon} alt="Diamonds Icon" /> {amount ? amount * activeItem.itemDiamonds : activeItem.itemDiamonds}</div>}
                                                </>
                                        }
                                    </div>

                                    <input type="number" placeholder="Amount" min={1} max={50} value={amount ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            if (value === "") {
                                                setAmount(null);
                                                return;
                                            }

                                            const num = Number(value);
                                            if (num < 1) {
                                                setAmount(1);
                                            } else if (num > 50) {
                                                setAmount(50);
                                            } else {
                                                setAmount(num);
                                            }
                                        }}
                                    />

                                    <Button color='grey' shadow={false} style={{ marginTop: 'auto' }} disabled={
                                        currentUser.credits < (amount ?? 1) * activeItem.itemCredits ||
                                        currentUser.duckets < (amount ?? 1) * activeItem.itemDuckets ||
                                        currentUser.diamonds < (amount ?? 1) * activeItem.itemDiamonds
                                    } onClick={(() => buyItem())}>Purchase</Button>
                                </>
                            }

                            {activeTab === HomeItemDialogTab.Inventory && activeItem &&
                                <Button color='grey' style={{ marginTop: 'auto' }} onClick={() => placeItem()}>Place</Button>
                            }
                        </div>
                    </>
                    : 'Please reconnect.'}
            </div>

            {activeTab === HomeItemDialogTab.WebStore && currentUser &&
                <div className="wallet">
                    <div className='row'><img src={creditsIcon} alt="Credits Icon" /> {currentUser.credits}</div>
                    <div className='row'><img src={ducketsIcon} alt="Duckets Icon" /> {currentUser.duckets}</div>
                    <div className='row'><img src={diamondsIcon} alt="Diamonds Icon" /> {currentUser.diamonds}</div>
                </div>
            }
        </div>
    )
}

export default HomeItemDialogContent;