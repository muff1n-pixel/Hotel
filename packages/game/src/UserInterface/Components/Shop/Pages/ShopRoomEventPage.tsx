import { ShopPageProps } from "./ShopPage";
import { useDialogs } from "../../../Hooks/useDialogs";
import { useUser } from "../../../Hooks/useUser";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import MembershipIcon from "@UserInterface/Common/Memberships/MembershipIcon";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import useShopPageMemberships from "@UserInterface/Components/Shop/Pages/Hooks/useShopPageMemberships";
import { webSocketClient } from "@Game/index";
import { PurchaseShopMembershipData, RoomEventCreationData } from "@pixel63/events";
import { useRoomCategories } from "@UserInterface/Hooks/useRoomCategories";
import Selection from "@UserInterface/Common/Form/Components/Selection";
import { useEffect, useState } from "react";
import Input from "@UserInterface/Common/Form/Components/Input";
import TextArea from "@UserInterface/Common/Form/Components/TextArea";
import { useUserRooms } from "@UserInterface/Hooks/useUserRooms";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useTranslation } from "react-i18next";

export default function ShopRoomEventPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();
    const room = useRoomInstance();
    const [getTranslation] = useTranslation("shop");

    const memberships = useShopPageMemberships(page.id);
    const roomCategories = useRoomCategories();
    const userRooms = useUserRooms();
    
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [categoryId, setCategoryId] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");

    useEffect(() => {
        if(room?.isOwner) {
            setRoomId(room.id);
        }
    }, [room]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <FlexLayout direction="row" justify="center" align="center" style={{
                padding: "2em 0"
            }}>
                {(page.teaser) && (
                    <FlexLayout direction="row" justify="center" align="center">
                        <img src={`./assets/shop/teasers/${page.teaser}`}/>
                    </FlexLayout>
                )}

                <FlexLayout style={{ flex: 1 }}>
                    <b>{getTranslation("promote.title")}</b>

                    <Selection placeholder={getTranslation("promote.category.placeholder")} value={categoryId} items={roomCategories?.map((category) => {
                        return {
                            value: category.id,
                            label: category.title
                        };
                    }) ?? []} onChange={(value) => setCategoryId(value as string)}/>

                    
                    <p>{getTranslation("promote.name")}</p>

                    <Input placeholder={getTranslation("promote.name.placeholder")} value={name} onChange={setName}/>
                    
                    <p>{getTranslation("promote.description")}</p>

                    <TextArea placeholder={getTranslation("promote.description.placeholder")} value={description} onChange={setDescription} style={{ height: 60 }}/>
                    
                    <p>{getTranslation("promote.room")}</p>

                    <Selection placeholder={getTranslation("promote.room.placeholder")} value={roomId} items={userRooms?.map((room) => {
                        return {
                            value: room.id,
                            label: room.name
                        };
                    }) ?? []} onChange={(value) => setRoomId(value as string)}/>
                </FlexLayout>
            </FlexLayout>

            <div style={{ flex: 1 }}/>

            <DialogScrollArea hideInactive contentStyle={{
                gap: 10,
                display: "flex",
                flexDirection: "column"
            }}>
                {memberships.sort((a, b) => a.days - b.days).map((membership) => (
                    <DialogPanel contentStyle={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 4,
                        gap: 5
                    }}>
                        <FlexLayout direction="row" align="center" style={{
                            background: "#a2a2a2",
                            borderRadius: 6,

                            padding: "4px 6px",

                            color: "#FFFFFF"
                        }}>
                            <MembershipIcon membership={membership.membership}/>
                            
                            <b style={{ paddingBottom: 1, flex: 1 }}>{getTranslation("promote.membership")}</b>

                            {(editMode) && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    cursor: "pointer"
                                }} onClick={() => dialogs.addUniqueDialog("edit-shop-membership", { page, membership })}>
                                    <div className="sprite_room_user_motto_pen" style={{
                                        marginTop: -2
                                    }}/>
                                </div>
                            )}
                        </FlexLayout>

                        <FlexLayout direction="row" align="center" justify="space-between">
                            <CurrencyPanel credits={membership.credits} duckets={membership.duckets} diamonds={membership.diamonds}/>

                            <div style={{ flex: 1 }}/>

                            <DialogButton color="green" disabled={(
                                (membership.credits ?? 0) > user.credits
                                || (membership.duckets ?? 0) > user.duckets
                                || (membership.diamonds ?? 0) > user.diamonds
                            )} style={{ flex: 1 }} onClick={() => {
                                webSocketClient.sendProtobuff(PurchaseShopMembershipData, PurchaseShopMembershipData.create({
                                    id: membership.id,

                                    event: RoomEventCreationData.create({
                                        name,
                                        description,

                                        roomId,
                                        categoryId
                                    })
                                }));
                            }}>
                                {getTranslation("purchase")}
                            </DialogButton>
                        </FlexLayout>
                    </DialogPanel>
                ))}

                {(editMode) && (
                    <div style={{
                        width: "100%",

                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",

                        cursor: "pointer"
                    }} onClick={() => dialogs.addUniqueDialog("edit-shop-membership", { page })}>
                        <div className="sprite_add" style={{
                            marginRight: 10
                        }}/>
                    </div>
                )}
            </DialogScrollArea>
        </div>
    );
}
