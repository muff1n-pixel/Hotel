import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../../Common/Dialog/Components/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { clientInstance, webSocketClient } from "../../../..";
import useShopPageFurniture from "./Hooks/useShopPageFurniture";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import { useDialogs } from "../../../Hooks/useDialogs";
import { useUser } from "../../../Hooks/useUser";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import { GroupData, PurchaseShopFurnitureData, RoomPositionData, RoomStructureData, ShopFurnitureData, ShopFurniturePurchaseData, UserFurnitureColorTag, UserFurnitureData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import usePurchasableItem from "@UserInterface/Components/Shop/Pages/Hooks/usePurchasableItem";
import DialogCurrencyPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogCurrencyPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Input from "@UserInterface/Common/Form/Components/Input";
import RoomRenderer from "@UserInterface/Common/Room/RoomRenderer";
import MembershipSmallIcon from "@UserInterface/Common/Memberships/MembershipSmallIcon";
import ShopGroupSelector from "@UserInterface/Components/Shop/Pages/Groups/ShopGroupSelector";

export default function ShopDefaultPage({ search, editMode, page, requestedFurnitureId }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();
    const room = useRoomInstance();

    const shopFurniture = useShopPageFurniture(page.id, undefined, search);

    const activeFurnitureRef = useRef<HTMLCanvasElement>(null);

    const [activeFurniture, setActiveFurniture] = useState<ShopFurnitureData>();

    const [quantity, setQuantity] = useState(1);
    const [group, setGroup] = useState<GroupData>();

    const handlePurchaseFurniture = useCallback((stopPlacing?: () => void, position?: RoomPositionData, direction?: number) => {
        if(!activeFurniture) {
            return;
        }

        dialogs.setDialogHidden("shop", true);

        dialogs.openUniqueDialog("shop-purchase-furniture", {
            activeFurniture,
            position,
            direction,
            stopPlacing,
            purchasableItem,
            group,
            quantity,
            activeFurnitureElement: activeFurnitureRef.current
        });
    }, [activeFurniture, activeFurnitureRef, quantity, group]);

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
            <div onMouseDown={() => activeFurniture && onMouseDown(activeFurniture)} style={{

                height: 240,
                width: "100%",

                cursor: (activeFurniture)?("pointer"):("inherit"),

                position: "relative"
            }}>

                <RoomRenderer
                    hidden={!activeFurniture}
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
                        (activeFurniture?.furniture)?([
                            {
                                id: activeFurniture.id,
                                furniture: activeFurniture.furniture,
                                panToItem: true,
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
                    <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,

                        padding: 10,

                        color: "white"
                    }}>
                        <b>{activeFurniture.furniture?.name}</b>

                        {(activeFurniture.furniture?.description) && (
                            <p style={{ fontSize: 12 }}>{activeFurniture.furniture.description}</p>
                        )}
                    </div>
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

                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ flex: 1 }}/>
                
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <FlexLayout flex={1} direction="row" align="center">
                        <div style={{ color: "#6A6A69" }}>Quantity</div>

                        <Input style={{ width: 30 }} value={quantity.toString()} min={1} max={100} onChange={(value) => setQuantity(window.isNaN(parseInt(value))?(1):(parseInt(value)))}/>
                    </FlexLayout>

                    <DialogButton color="green" disabled={!activeFurniture || (
                        (activeFurniture.credits ?? 0) > user.credits
                        || (activeFurniture.duckets ?? 0) > user.duckets
                        || (activeFurniture.diamonds ?? 0) > user.diamonds
                        || (activeFurniture.membership === "habbogroup" && !group)
                    )} style={{ flex: 1 }} onClick={() => handlePurchaseFurniture()}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
