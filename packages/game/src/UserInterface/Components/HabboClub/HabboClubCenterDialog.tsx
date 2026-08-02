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

export type HabboClubCenterDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function HabboClubCenterDialog({ hidden, onClose }: HabboClubCenterDialogProps) {
    const user = useUser();
    const userHabboClub = useUserHabboClub(true);

    const { openShopPage } = useShopPageLink("habboclub");

    return (
        <Dialog title="Habbo Club Center" hidden={hidden} onClose={onClose} width={459} height={600} initialPosition="center">
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

                    <DialogButton color="green" onClick={openShopPage} style={{ width: "max-content" }}>{((userHabboClub?.active))?("Buy more Habbo Club"):("Buy Habbo Club")}</DialogButton>
                </div>
            </div>

            <DialogContent style={{ paddingTop: 0 }}>
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
                        <b>Status: {(userHabboClub?.active)?("Active"):("Inactive")}</b>

                        {(userHabboClub?.active)?(
                            <FlexLayout direction="column" gap={0}>
                                <p>Time left: <b>{DateHelper.getFormattedTimeUntilDate(userHabboClub.expiresAt)}</b></p>

                                <p>First joined: <b>{DateHelper.getFormattedDate(userHabboClub.memberSince)}</b></p>
                                
                                <p>Current streak: <b>{DateHelper.getFormattedTimeFromDays(userHabboClub.membershipStreak)}</b></p>
                            </FlexLayout>
                        ):(
                            <p>You are not a current Habbo Club member. Check out what you're missing...</p>
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
                        <b style={{ fontSize: 17 }}>HC Payday</b>

                        <p>HC members get credits back from catalog purchases each month.</p>
                    </FlexLayout>

                    <div className="sprite_habboclub_sticker" style={{
                        marginTop: -8,
                        marginRight: -8,

                        color: "#6B3502",

                        boxSizing: "border-box",

                        overflow: "hidden",

                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        <FlexLayout gap={10} direction="column" style={{
                            height: 80,
                            padding: 15,
                            paddingBottom: 0
                        }}>
                            <b style={{ fontSize: 17 }}>HC Payday is in:</b>

                            <FlexLayout direction="row" align="center">
                                <div className="sprite_habboclub_payday_time"/>

                                <p style={{ fontSize: 14 }}>13 d.</p>
                            </FlexLayout>
                        </FlexLayout>

                        <FlexLayout gap={0} direction="column" justify="center" style={{
                            paddingLeft: 15,
                            paddingBottom: 12
                        }}>
                            <b style={{ fontSize: 14 }}>You'll be getting:</b>

                            <CurrencyPanel credits={userHabboClub?.cashback}/>
                        </FlexLayout>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
