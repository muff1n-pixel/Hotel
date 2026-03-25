import { act, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './HomeItemDialogCategories.css'
import { HomeItemType, HomeType } from '../../../../Pages/HomePage/HomePage';
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
    homeType: HomeType,
    activeTab: HomeItemDialogTab,
    inventory: HomeItemType[],
    setLoadItems: (boolean) => void,
    onItemsLoaded: (items: any) => void;
    setInventory: React.Dispatch<React.SetStateAction<HomeItemType[]>>;
    onCategoryChange: (category: string) => void;
}

const HomeItemDialogCategories = ({ homeType, activeTab, inventory, setLoadItems, onItemsLoaded, setInventory, onCategoryChange }: HomeItemDialogCategoriesProps) => {
    const { state: { currentUser }, dispatch } = useContext(ThemeContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const hasUserClicked = useRef(false);

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

    return (
        <div>
            <div className='label'>Categories</div>
            {loading ? <Loading style={{ justifyContent: 'flex-start', marginTop: '10px' }} /> :
                <ul className="navigation">
                    {filteredCategories.map((cat, index) => (
                        <li key={cat.id}>
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
                                            onCategoryChange(cat.subs[0].id);
                                        }
                                    } else {
                                        setOpenIndex(null);
                                        setActive({
                                            type: "category",
                                            parent: index,
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