import { webSocketClient } from "@Game/index";
import { GroupBadgeData, GroupColorsData, GroupCreationData, GroupIdentityData, PurchaseShopMembershipData, ShopPageData } from "@pixel63/events";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogItem from "@UserInterface/Common/Dialog/Components/Item/DialogItem";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import DialogPanel from "@UserInterface/Common/Dialog/Components/Panels/DialogPanel";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import MembershipIcon from "@UserInterface/Common/Memberships/MembershipIcon";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import useShopPageMemberships from "@UserInterface/Components/Shop/Pages/Hooks/useShopPageMemberships";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUser } from "@UserInterface/Hooks/useUser";

export type RoomGroupCreationFinalStepProps = {
    identityData?: GroupIdentityData;
    badgeData?: GroupBadgeData;
    colorsData?: GroupColorsData;
    page: ShopPageData;
    editMode: boolean;
    goBack: () => void;
}

export default function RoomGroupCreationFinalStep({ page, editMode, identityData, badgeData, colorsData, goBack }: RoomGroupCreationFinalStepProps) {
    const user = useUser();
    const dialogs = useDialogs();
    const memberships = useShopPageMemberships(page.id);

    return (
        <FlexLayout flex={1} direction="row">
            <FlexLayout direction="column">
                <b>Group badge</b>

                <DialogPanel color="silver" style={{
                    aspectRatio: 1
                }} contentStyle={{ display: "flex" }}>
                    <FlexLayout flex={1} align="center" justify="center">
                        <GroupBadgeImage data={badgeData}/>
                    </FlexLayout>
                </DialogPanel>

                <b>Group colors</b>

                <DialogPanel color="silver" contentStyle={{ display: "flex" }}>
                    <FlexLayout flex={1} gap={4} direction="row" align="center" justify="center" style={{
                        padding: 2
                    }}>
                        <DialogItem height={30} containerStyle={{ cursor: "unset" }} style={{
                            background: colorsData?.primaryColor
                        }}/>

                        <DialogItem height={30} containerStyle={{ cursor: "unset" }} style={{
                            background: colorsData?.secondaryColor
                        }}/>
                    </FlexLayout>
                </DialogPanel>

                <div style={{ flex: 1 }}/>

                <DialogLink onClick={goBack}>Go back</DialogLink>
            </FlexLayout>

            <FlexLayout flex={1} direction="column">
                <b style={{ fontSize: 20 }}>{identityData?.name ?? `${user.name}'s group`}</b>

                <p>Your Group is now set up and ready to go. When you have purchased your Group, you can start inviting users and giving rights to members.</p>

                <div style={{ flex: 1 }}/>

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
                            
                            <b style={{ paddingBottom: 1, flex: 1 }}>Habbo Group</b>

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
                                    group: GroupCreationData.create({
                                        identity: identityData,
                                        badge: badgeData,
                                        colors: colorsData
                                    })
                                }));

                                dialogs.closeDialog("room-group-creation");
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
            </FlexLayout>
        </FlexLayout>
    );
}