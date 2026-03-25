import { act, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './HomeItemDialogCategories.css'
import { HomeItemType, HomeType, HomeLastModalOpenType } from '../../../../Pages/HomePage/HomePage';
import Loading from '../../../Loading/Loading';
import { HomeItemDialogTab } from '../HomeItemDialog';
import { ThemeContext } from '../../../../../../Themes/default/ThemeProvider';

type BaseCategory = {
    id: string;
    title: string;
    description?: string | null;
    visible: boolean;
};

type SubCategoryType = BaseCategory;

type CategoryType = BaseCategory & {
    subs: SubCategoryType[] | null;
};

type HomeItemDialogCategoriesProps = {
    lastModalOpen: HomeLastModalOpenType,
    homeType: HomeType,
    activeTab: HomeItemDialogTab,
    inventory: HomeItemType[],
    setLastModalOpen: (data: HomeLastModalOpenType) => void,
    setLoadItems: (boolean) => void,
    onItemsLoaded: (items: any) => void;
    setInventory: React.Dispatch<React.SetStateAction<HomeItemType[]>>;
    onCategoryChange: (category: string) => void;
}

const HomeItemDialogCategories = ({ lastModalOpen, homeType, activeTab, inventory, setLoadItems, onItemsLoaded, setInventory, onCategoryChange, setLastModalOpen }: HomeItemDialogCategoriesProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
    const subRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const hasUserClicked = useRef(false);
    const tabJustChanged = useRef(false);

    const [active, setActive] = useState<{
        type: "category" | "sub";
        parent: number;
        index?: number;
    } | null>(null);

    const filteredCategories = useMemo(() => {
        if (activeTab === HomeItemDialogTab.WebStore) {
            return categories.filter(category => category.visible && category.id != "widgets");
        }

        return categories
            .filter(category => {
                if (!category.subs) {
                    return inventory.some(item => item.itemPage === category.id);
                }

                return category.subs.some(sub =>
                    inventory.some(item => item.itemPage === sub.id)
                );
            })
            .map(category => {
                if (!category.subs) return category;

                return {
                    ...category,
                    subs: category.subs.filter(sub =>
                        inventory.some(item => item.itemPage === sub.id)
                    )
                };
            });
    }, [categories, inventory, activeTab]);

    useEffect(() => {
        tabJustChanged.current = true;
        setOpenIndex(null);
        setActive(null);

        if (activeTab === HomeItemDialogTab.Inventory) {
            fetch("/api/home/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.error) {
                        console.error("(Error) Impossible to get inventory:", result.error)
                        return;
                    }

                    setInventory(result);
                })
                .catch((e) => {
                    console.error("(Error) Impossible to get inventory:", e)
                })
        }
    }, [activeTab]);

    useEffect(() => {
        if (!active) return;

        const parent = filteredCategories[active.parent];

        if (!parent) return;

        let selected;

        if (active.type === "category") {
            selected = parent;
        } else {
            selected = parent.subs?.[active.index!];
        }

        if (!selected) return;

        const stillExists = filteredCategories.some(cat =>
            cat.id === selected.id ||
            cat.subs?.some(sub => sub.id === selected.id)
        );

        if (!stillExists) return;

        if (activeTab === HomeItemDialogTab.WebStore) {
            setLoadItems(true);

            fetch("/api/home/shop/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    homeType: homeType === HomeType.User ? 'user' : 'group',
                    pageId: selected.id
                })
            })
                .then(res => res.json())
                .then(result => {
                    if (result.error) return console.error(result.error);
                    onItemsLoaded(result);
                })
                .catch(console.error);
        } else {
            const filteredItems = inventory.filter(
                item => item.itemPage === selected.id
            );

            onItemsLoaded(filteredItems);
        }
    }, [active, inventory]);

    useEffect(() => {
        fetch("/api/home/shop/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                homeType: homeType === HomeType.User ? 'user' : 'group'
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    console.error("(Error) Impossible to get categories:", result.error)
                    return;
                }

                setCategories(result);
                setLoading(false);
            })
            .catch((e) => {
                console.error("(Error) Impossible to get categories:", e)
            })
    }, []);

useEffect(() => {
    if (!tabJustChanged.current) return;
    if (loading) return;
    if (!filteredCategories.length) return;

    const current =
        activeTab === HomeItemDialogTab.Inventory
            ? lastModalOpen.inventory
            : lastModalOpen.webshop;

    const subId = current.sub?.id;
    const categoryId = current.category?.id;

    if (subId) {
        for (let i = 0; i < filteredCategories.length; i++) {
            const cat = filteredCategories[i];

            const subIndex = cat.subs?.findIndex(
                sub => sub.id === subId
            );

            if (subIndex !== undefined && subIndex !== -1) {
                setOpenIndex(i);
                setActive({
                    type: "sub",
                    parent: i,
                    index: subIndex
                });
                onCategoryChange(subId);

                tabJustChanged.current = false;
                return;
            }
        }
    }

    if (categoryId) {
        const index = filteredCategories.findIndex(
            cat => cat.id === categoryId
        );

        if (index !== -1) {
            setOpenIndex(index);
            setActive({
                type: "category",
                parent: index
            });
            onCategoryChange(categoryId);

            tabJustChanged.current = false;
        }
    }

}, [filteredCategories, loading, activeTab]);

    useEffect(() => {
        if (!active) return;

        if (active.type === "sub") {
            const parent = filteredCategories[active.parent];
            const sub = parent?.subs?.[active.index!];

            if (!sub) return;

            const el = subRefs.current[sub.id];

            if (el) {
                requestAnimationFrame(() => {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            }

            return;
        }

        if (openIndex !== null) {
            const el = itemRefs.current[openIndex];

            if (el) {
                requestAnimationFrame(() => {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            }
        }

    }, [active, openIndex]);

    return (
        <div>
            <div className='label'>Categories</div>
            {loading ? <Loading style={{ justifyContent: 'flex-start', marginTop: '10px' }} /> :
                <ul className="navigation">
                    {filteredCategories.map((cat, index) => (
                        <li key={cat.id} ref={(el) => {
                            itemRefs.current[index] = el;
                        }}>
                            <div
                                className={[
                                    "item",
                                    cat.subs ? "has-sub" : "",
                                    openIndex === index ? "open" : "",
                                    !cat.subs &&
                                        active?.type === "category" &&
                                        active.parent === index
                                        ? "active"
                                        : "",
                                ].join(" ")}
                                onClick={() => {
                                    hasUserClicked.current = true;

                                    if (cat.subs) {
                                        if (openIndex === index) {
                                            setOpenIndex(null);
                                            setActive(null);
                                        } else {
                                            setOpenIndex(index);
                                            setActive({
                                                type: "sub",
                                                parent: index,
                                                index: 0,
                                            });

                                            const key = activeTab === HomeItemDialogTab.Inventory ? "inventory" : "webshop";
                                            setLastModalOpen({
                                                ...lastModalOpen,
                                                [key]: {
                                                    ...lastModalOpen[key],
                                                    category: null,
                                                    sub: cat.subs?.[0] ?? null
                                                }
                                            });
                                            onCategoryChange(cat.subs[0].id);
                                        }
                                    } else {
                                        setOpenIndex(null);
                                        setActive({
                                            type: "category",
                                            parent: index,
                                        });

                                        const key = activeTab === HomeItemDialogTab.Inventory ? "inventory" : "webshop";
                                        setLastModalOpen({
                                            ...lastModalOpen,
                                            [key]: {
                                                sub: null,
                                                category: {
                                                    id: cat.id
                                                }
                                            }
                                        });
                                        onCategoryChange(cat.id);
                                    }
                                }}
                            >
                                {cat.title}
                            </div>

                            {cat.subs && openIndex === index && (
                                <ul className="sub-navigation">
                                    {cat.subs.map((sub, i) => (
                                        <li
                                            key={sub.id}
                                            ref={(el) => {
                                                subRefs.current[sub.id] = el;
                                            }}
                                            className={[
                                                "sub-item",
                                                active?.type === "sub" &&
                                                    active.parent === index &&
                                                    active.index === i
                                                    ? "active"
                                                    : "",
                                            ].join(" ")}
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                setActive({
                                                    type: "sub",
                                                    parent: index,
                                                    index: i,
                                                });

                                                const key = activeTab === HomeItemDialogTab.Inventory ? "inventory" : "webshop";
                                                setLastModalOpen({
                                                    ...lastModalOpen,
                                                    [key]: {
                                                        category: null,
                                                        sub: {
                                                            id: sub.id
                                                        }
                                                    }
                                                });
                                                onCategoryChange(sub.id);
                                            }}
                                        >
                                            {sub.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default HomeItemDialogCategories;