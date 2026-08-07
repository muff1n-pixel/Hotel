import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../../Common/Dialog/Components/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { clientInstance } from "../../../..";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import { useDialogs } from "../../../Hooks/useDialogs";
import { useUser } from "../../../Hooks/useUser";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import { GroupData, RoomPositionData, RoomStructureData, ShopFurnitureData, UserFurnitureColorTag, UserFurnitureData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import usePurchasableItem from "@UserInterface/Components/Shop/Pages/Hooks/usePurchasableItem";
import DialogCurrencyPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogCurrencyPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Input from "@UserInterface/Common/Form/Components/Input";
import RoomRenderer from "@UserInterface/Common/Room/RoomRenderer";
import MembershipSmallIcon from "@UserInterface/Common/Memberships/MembershipSmallIcon";
import ShopGroupSelector from "@UserInterface/Components/Shop/Pages/Groups/ShopGroupSelector";
import { useTranslation } from "react-i18next";
import { useSettings } from "@UserInterface/Hooks/useSettings";
import useShopPurchaseFurniture, { ShopPurchaseFurnitureData } from "../Purchasing/Hooks/useShopPurchaseFurniture";
import Furniture from "@Client/Furniture/Furniture";

export default function ShopDefaultPage({ search, editMode, page, requestedFurnitureId }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();
    const room = useRoomInstance();
    const [getTranslation] = useTranslation("shop");
    const settings = useSettings();
    const purchaseFurniture = useShopPurchaseFurniture();

    const shopFurniture = useShopPageFurniture(page.id, undefined, search);

    const activeFurnitureRef = useRef<HTMLCanvasElement>(null);

    const [activeFurniture, _setActiveFurniture] = useState<ShopFurnitureData>();
    const [activeFurnitureRenderer, setActiveFurnitureRenderer] = useState<Furniture>();
    const [activeAnimationId, setActiveAnimationId] = useState(0);
    const [activeDirection, setActiveDirection] = useState<number | undefined>();

    const [quantity, setQuantity] = useState(1);
    const [group, setGroup] = useState<GroupData>();

    const setActiveFurniture = useCallback((shopFurniture?: ShopFurnitureData) => {
        setActiveAnimationId(0);
        setActiveDirection(undefined);
        setActiveFurnitureRenderer(undefined);

        if(!shopFurniture?.furniture) {
            return;
        }

        const furniture = new Furniture(shopFurniture.furniture.type, 64, undefined, undefined, shopFurniture.furniture.color);

        furniture.loadAssets().then(() => {
            _setActiveFurniture(shopFurniture);

            setActiveFurnitureRenderer(furniture);
        });
    }, [setActiveAnimationId, setActiveFurnitureRenderer, _setActiveFurniture]);

    const handlePurchaseFurniture = useCallback((stopPlacing?: () => void, position?: RoomPositionData, direction?: number) => {
        if(!activeFurniture) {
            return;
        }

        const data: ShopPurchaseFurnitureData = {
            activeFurniture,
            position,
            direction,
            stopPlacing,
            purchasableItem,
            group,
            quantity,
            activeFurnitureElement: activeFurnitureRef.current
        };

        if(settings.disablePurchaseConfirmation) {
            purchaseFurniture(data);
        }
        else {
            dialogs.setDialogHidden("shop", true);

            dialogs.openUniqueDialog("shop-purchase-furniture", data);
        }
    }, [activeFurniture, activeFurnitureRef, quantity, group, settings, purchaseFurniture]);

    const handleGiftFurniture = useCallback(() => {
        if(!activeFurniture) {
            return;
        }

        dialogs.setDialogHidden("shop", true);

        dialogs.openUniqueDialog("shop-gift-furniture", {
            activeFurniture,
            group,
        });
    }, [activeFurniture, group]);

    const purchasableItem = usePurchasableItem(handlePurchaseFurniture);

    useEffect(() => {
        if(requestedFurnitureId) {
            const requestedShopFurniture = shopFurniture.find((furniture) => furniture.furniture?.id === requestedFurnitureId);

            if(requestedShopFurniture) {
                setActiveFurniture(requestedShopFurniture);

                return;
            }
        }

        if(!page.teaser) {
            setActiveFurniture(shopFurniture[0]);
        }
    }, [page, shopFurniture]);

    const onRoomClick = useCallback((furniture: ShopFurnitureData) => {
        if(!activeFurnitureRenderer) {
            return;
        }

        setActiveAnimationId(activeFurnitureRenderer.getNextAnimation());
    }, [activeFurnitureRenderer, setActiveAnimationId]);

    const handlePreviousDirection = useCallback(() => {
        if(!activeFurnitureRenderer) {
            return;
        }

        setActiveDirection(activeFurnitureRenderer.getPreviousDirection());
    }, [activeFurnitureRenderer, setActiveAnimationId]);

    const handleNextDirection = useCallback(() => {
        if(!activeFurnitureRenderer) {
            return;
        }

        setActiveDirection(activeFurnitureRenderer.getNextDirection());
    }, [activeFurnitureRenderer, setActiveAnimationId]);

    const onMouseDown = useCallback((furniture: ShopFurnitureData) => {
        if(!clientInstance.roomInstance.value) {
            return;
        }

        if(activeFurniture?.id !== furniture.id) {
            return;
        }

        const mousemove = () => {
            document.body.removeEventListener("mousemove", mousemove);

            if(room && furniture.furniture) {
                if((activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds) {
                    return;
                }

                purchasableItem.startPlacing(RoomFurniturePlacer.fromFurnitureData(room, furniture.furniture, UserFurnitureData.create({
                    colorTags: (group) && [
                        UserFurnitureColorTag.create({
                            tag: "COLOR1",
                            color: group.primaryColor
                        }),
                        UserFurnitureColorTag.create({
                            tag: "COLOR2",
                            color: group.secondaryColor
                        })
                    ]
                })));                
            }
        };

        document.body.addEventListener("mousemove", mousemove);

        document.body.addEventListener("mouseup", () => {
            document.body.removeEventListener("mousemove", mousemove);
        }, {
            once: true
        });
    }, [ dialogs, room, activeFurniture, purchasableItem ]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div style={{
                height: 240,
                width: "100%",

                cursor: (activeFurniture)?("pointer"):("inherit"),

                position: "relative"
            }}>

                <RoomRenderer
                    hidden={!activeFurniture}
                    onClick={() => activeFurniture && onRoomClick(activeFurniture)}
                    structure={RoomStructureData.create({
                        grid: new Array(7).fill(null).map((_) => new Array(7).fill(null).map(() => '0').join('')),
                        floor: {
                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.floor?.id ?? "111",
                            thickness: 8
                        },
                        wall: {
                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.wall?.id ?? "201",
                            thickness: 8,
                            hidden: false
                        },
                        landscape: {
                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.landscape?.id ?? "default",
                        }
                    })}
                    furniture={
                        (activeFurniture?.furniture && activeFurnitureRenderer)?([
                            {
                                id: activeFurniture.furniture.id,
                                furniture: activeFurniture.furniture,
                                furnitureRenderer: activeFurnitureRenderer,
                                direction: activeDirection,
                                animationId: activeAnimationId,
                                colorTags: (group) && [
                                    UserFurnitureColorTag.create({
                                        tag: "COLOR1",
                                        color: group.primaryColor
                                    }),
                                    UserFurnitureColorTag.create({
                                        tag: "COLOR2",
                                        color: group.secondaryColor
                                    })
                                ]
                            }
                        ]):([])
                    }
                    />

                {(activeFurniture) && (
                    <FlexLayout direction="row" style={{
                        position: "absolute",
                        left: 0,
                        top: 0,

                        width: "100%",
                        boxSizing: "border-box",

                        padding: 10,

                        color: "white"
                    }}>
                        <FlexLayout flex={1} direction="column" gap={5}>
                            <b>{activeFurniture.furniture?.name}</b>

                            {(activeFurniture.furniture?.description) && (
                                <p style={{ fontSize: 12 }}>{activeFurniture.furniture.description}</p>
                            )}
                        </FlexLayout>

                        <FlexLayout gap={5} direction="row">
                            <DialogButton contentStyle={{
                                paddingLeft: "6px",
                                paddingRight: "6px"
                            }} onClick={handlePreviousDirection}>
                                <div className="sprite_forms_arrow-big" style={{
                                    transform: "rotateZ(180deg)"
                                }}/>
                            </DialogButton>

                            <DialogButton contentStyle={{
                                paddingLeft: "6px",
                                paddingRight: "6px"
                            }} onClick={handleNextDirection}>
                                <div className="sprite_forms_arrow-big"/>
                            </DialogButton>
                        </FlexLayout>
                    </FlexLayout>
                )}

                {(activeFurniture) && (
                    <div style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,

                        padding: 10,
                    }}>
                        <DialogCurrencyPanel multiplier={quantity} credits={activeFurniture.credits} duckets={activeFurniture.duckets} diamonds={activeFurniture.diamonds}/>
                    </div>
                )}

                {(!activeFurniture && page.teaser) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img src={`./assets/shop/teasers/${page.teaser}`}/>
                    </div>
                )}
            </div>

            <DialogPanel style={{ flex: "1 1 0", overflow: "hidden" }} contentStyle={{ display: "flex", flex: 1 }}>
                <DialogScrollArea hideInactive>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        
                        padding: 4,
                        paddingRight: 0,
                        overflowY: "scroll"
                    }}>
                        {shopFurniture.map((furniture) => (
                            <div key={furniture.id} style={{
                                width: 53,
                                height: 62,
                                boxSizing: "border-box",

                                borderRadius: 5,

                                border: (activeFurniture?.id === furniture.id)?("2px solid #62C4E8"):("2px solid transparent"),
                                background: (activeFurniture?.id === furniture.id)?("#FFFFFF"):(undefined),

                                display: "flex",
                                justifyContent: "center",

                                cursor: "pointer"
                            }} onClick={() => (activeFurniture?.id !== furniture.id) && setActiveFurniture(furniture)}>
                                <div style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    justifySelf: "center",

                                    position: "relative"
                                }}>
                                    <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }} onMouseDown={() => onMouseDown(furniture)}>
                                        <FurnitureIcon ref={(activeFurniture?.id === furniture.id)?(activeFurnitureRef):(undefined)} furnitureData={furniture.furniture} colorTags={(group) && [
                                            UserFurnitureColorTag.create({
                                                tag: "COLOR1",
                                                color: group.primaryColor
                                            }),
                                            UserFurnitureColorTag.create({
                                                tag: "COLOR2",
                                                color: group.secondaryColor
                                            })
                                        ]}/>
                                    </div>

                                    {(furniture.credits) && (
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 2,
                                            alignItems: "flex-end",
                                            justifyContent: "flex-end",
                                            padding: 2,
                                        }}>
                                            <b>{furniture.credits}</b>

                                            <div className="sprite_currencies_credits-small"/>
                                        </div>
                                    )}

                                    {(furniture.duckets) && (
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 2,
                                            alignItems: "flex-end",
                                            justifyContent: "flex-end",
                                            padding: 2,
                                        }}>
                                            <b>{furniture.duckets}</b>

                                            <div className="sprite_currencies_duckets-small"/>
                                        </div>
                                    )}

                                    {(furniture.diamonds) && (
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 2,
                                            alignItems: "flex-end",
                                            justifyContent: "flex-end",
                                            padding: 2,
                                        }}>
                                            <b>{furniture.diamonds}</b>

                                            <div className="sprite_currencies_diamonds-small"/>
                                        </div>
                                    )}

                                    {(furniture.membership) && (
                                        <div style={{
                                            position: "absolute",
                                            top: -4,
                                            right: 2,
                                        }}>
                                            <MembershipSmallIcon membership={furniture.membership}/>
                                        </div>
                                    )}

                                    {(editMode) && (
                                        <div style={{
                                            position: "absolute",
                                            top: -10,
                                            right: -6,
                                            cursor: "pointer"
                                        }} onClick={() => dialogs.addUniqueDialog("edit-shop-furniture", { ...furniture, page: page })}>
                                            <div className="sprite_room_user_motto_pen"/>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {(editMode) && (
                            <div style={{
                                width: 53,
                                height: 62,

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                cursor: "pointer"
                            }} onClick={() => dialogs.addUniqueDialog("edit-shop-furniture", { page })}>
                                <div className="sprite_add" style={{
                                    marginTop: -8
                                }}/>
                            </div>
                        )}
                    </div>
                </DialogScrollArea>
            </DialogPanel>

            {(activeFurniture?.membership === "habbogroup") && (
                <ShopGroupSelector value={group} onChange={setGroup}/>
            )}

            <div style={{
                //height: 52,

                gap: 10,

                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10
                }}>
                    <div style={{ flex: 1 }}/>
                    
                    <FlexLayout flex={1} direction="row" align="center">
                        <div style={{ color: "#6A6A69" }}>{getTranslation("quantity")}</div>

                        <div style={{ flex: 1 }}/>

                        <Input style={{ width: 30 }} type="number" value={quantity.toString()} min={1} max={100} onChange={(value) => setQuantity(window.isNaN(parseInt(value))?(1):(parseInt(value)))}/>
                    </FlexLayout>
                </div>
                
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10
                }}>
                    <DialogButton disabled={!activeFurniture || (
                        (activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds
                        || (activeFurniture.membership === "habbogroup" && !group)
                        || (quantity !== 1)
                        || (!activeFurniture.furniture?.flags?.giftable)
                    )} style={{ flex: 1 }} onClick={() => handleGiftFurniture()}>{getTranslation("buy_gift")}</DialogButton>

                    <DialogButton color="green" disabled={!activeFurniture || (
                        (activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds
                        || (activeFurniture.membership === "habbogroup" && !group)
                    )} style={{ flex: 1 }} onClick={() => handlePurchaseFurniture()}>{getTranslation("purchase")}</DialogButton>
                </div>
            </div>
        </div>
    );
}
