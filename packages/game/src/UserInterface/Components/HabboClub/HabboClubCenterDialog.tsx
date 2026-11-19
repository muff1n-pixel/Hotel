import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import { useUser } from "@UserInterface/Hooks/useUser";
import DateHelper from "@UserInterface/Utils/DateHelper";
import useShopPageLink from "../Shop/Hooks/useShopPageLink";
import { useUserHabboClub } from "@UserInterface/Hooks/User/HabboClub/useUserHabboClub";
import { Fragment } from "react/jsx-runtime";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import CurrencyPanel from "@UserInterface/Common/Currencies/CurrencyPanel";
import { useTranslation } from "react-i18next";

export type HabboClubCenterDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function HabboClubCenterDialog({ hidden, onClose }: HabboClubCenterDialogProps) {
    const [getTranslation] = useTranslation("habboclub");
    const user = useUser();
    const userHabboClub = useUserHabboClub(true);

    const { openShopPage } = useShopPageLink("habboclub");
    const { openShopPage: openGiftShopPage } = useShopPageLink("habbogift");

    return (
        <Dialog title={getTranslation("title")} hidden={hidden} onClose={onClose} width={459} height={600} initialPosition="center">
            <div style={{
                position: "relative"
            }}>
                <div className="sprite_habboclub_banner" style={{
                    position: "absolute",

                    top: 0,
                    right: 0,

                    zIndex: 0
                }}/>

                <div style={{
                    position: "absolute",

                    top: 10,
                    right: 10,

                    width: 120,

                    display: "flex",
                    justifyContent: "center"
                }}>
                    <FigureImage figureConfiguration={user.figureConfiguration} direction={4} scale={2} style={{
                        position: "absolute"
                    }}/>
                </div>

                <div style={{
                    position: "relative",

                    padding: "0px 20px",

                    width: 320,
                    height: 136,

                    display: "flex",
                    gap: 20,

                    flexDirection: "column",

                    justifyContent: "center"
                }}>
                    <div className="sprite_habboclub_logo"/>

                    <DialogButton color="green" onClick={openShopPage} style={{ width: "max-content" }}>{getTranslation((userHabboClub?.active)?"purchase.buy_more":"purchase.buy")}</DialogButton>
                </div>
            </div>

            <DialogContent style={{ paddingTop: 0, position: "relative" }}>
                <div style={{
                    display: "flex",

                    height: 80,
                    paddingRight: 140,

                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>
                    {(userHabboClub?.badge) && (
                        <div style={{
                            display: "flex",
                            
                            justifyContent: "center",
                            alignItems:  "center",

                            width: 60,
                            height: 60
                        }}>
                            <BadgeImage badge={userHabboClub.badge}/>
                        </div>
                    )}
                    
                    <FlexLayout gap={2} direction="column">
                        <b>{getTranslation("status.label")}: {(userHabboClub?.active)?(getTranslation("status.active")):(getTranslation("status.inactive"))}</b>

                        {(userHabboClub?.active)?(
                            <FlexLayout direction="column" gap={0}>
                                <p>{getTranslation("status.time_left")} <b>{DateHelper.getFormattedTimeUntilDate(userHabboClub.expiresAt)}</b></p>

                                <p>{getTranslation("status.first_joined")} <b>{DateHelper.getFormattedDate(userHabboClub.memberSince)}</b></p>
                                
                                <p>{getTranslation("status.current_streak")} <b>{DateHelper.getFormattedTimeFromDays(userHabboClub.membershipStreak)}</b></p>
                            </FlexLayout>
                        ):(
                            <p>{getTranslation("status.not_member")}</p>
                        )}
                    </FlexLayout>
                </div>

                <div style={{
                    height: 128,

                    background: "#52A2CA",
                    color: "#FFFFFF",

                    borderRadius: 6,

                    display: "flex",
                    flexDirection: "row"
                }}>
                    <FlexLayout flex={1} style={{
                        padding: 20
                    }}>
                        <b style={{ fontSize: 17 }}>{getTranslation("payday.title")}</b>

                        <p>{getTranslation("payday.description")}</p>
                    </FlexLayout>

                    <div className="sprite_habboclub_sticker" style={{
                        marginTop: -8,
                        marginRight: -8,

                        color: "#6B3502",

                        boxSizing: "border-box",

                        overflow: "hidden",

                        display: "flex",
                        flexDirection: "column",
                        gap: 5,

                        zIndex: 1
                    }}>
                        <FlexLayout gap={10} direction="column" style={{
                            height: 80,
                            padding: 15,
                            paddingBottom: 0
                        }}>
                            <b style={{ fontSize: 17 }}>{getTranslation("payday.in")}</b>

                            <FlexLayout direction="row" align="center">
                                <div className="sprite_habboclub_payday_time"/>

                                <p style={{ fontSize: 14 }}>{getTranslation("payday.days", { days: 13 })}</p>
                            </FlexLayout>
                        </FlexLayout>

                        <FlexLayout gap={0} direction="column" justify="center" style={{
                            paddingLeft: 15,
                            paddingBottom: 12
                        }}>
                            <b style={{ fontSize: 14 }}>{getTranslation("payday.getting")}</b>

                            <CurrencyPanel credits={userHabboClub?.cashback}/>
                        </FlexLayout>
                    </div>
                </div>

                <div style={{ height: 6 }}/>

                <div style={{
                    background: "#53C22D",
                    color: "#FFFFFF",

                    borderRadius: 6,

                    display: "flex",
                    flexDirection: "row",

                    padding: 20
                }}>
                    <FlexLayout flex={1} gap={5}>
                        <b style={{ fontSize: 17 }}>{getTranslation("gift.title")}</b>

                        <p>{getTranslation("gift.description")}</p>
                    </FlexLayout>

                    <FlexLayout align="center" justify="center">
                        <DialogButton color="blue" onClick={openGiftShopPage}>{getTranslation("gift.view")}</DialogButton>
                    </FlexLayout>
                </div>

                <div style={{ height: 6 }}/>

                <div style={{
                    display: "flex",
                    flexDirection: "row",

                    padding: "10px 20px"
                }}>
                    <FlexLayout flex={1} gap={5}>
                        <b style={{ fontSize: 17, color: "#4A8EB1" }}>{getTranslation("benefits.title")}</b>

                        <p>{getTranslation("benefits.clothing")}</p>
                        <p>{getTranslation("benefits.dances")}</p>
                        <p>{getTranslation("benefits.duckets")}</p>
                        <p>{getTranslation("benefits.more")}</p>
                    </FlexLayout>
                </div>

                <div className="sprite_habboclub_teaser" style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0
                }}/>
            </DialogContent>
        </Dialog>
    );
}
