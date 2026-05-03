import { ShopPageProps } from "./ShopPage";
import { useDialogs } from "../../../Hooks/useDialogs";
import { useUser } from "../../../Hooks/useUser";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import MembershipIcon from "@UserInterface/Common/Memberships/MembershipIcon";
import DateHelper from "@UserInterface/Utils/DateHelper";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import useShopPageMemberships from "@UserInterface/Components/Shop/Pages/Hooks/useShopPageMemberships";
import { webSocketClient } from "@Game/index";
import { PurchaseShopMembershipData } from "@pixel63/events";

export default function ShopHabboClubPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const memberships = useShopPageMemberships(page.id);

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
                    <b>Join the Habbo Club!</b>
                    
                    <p>Get exclusive clothes, hair styles, furniture, and so much more!</p>
                </FlexLayout>
            </FlexLayout>

            {(DateHelper.isDateInTheFuture(user.habboClub)) && (
                <div style={{ textAlign: "center" }}><i>You have {DateHelper.getDaysBetweenDates(user.habboClub, new Date())} days left on your membership.</i></div>
            )}

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
                            
                            <b style={{ paddingBottom: 1, flex: 1 }}>{DateHelper.getFormattedDays(membership.days)}</b>

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
                                    id: membership.id
                                }));
                            }}>
                                Purchase
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
