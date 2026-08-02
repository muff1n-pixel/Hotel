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

export type HabboClubCenterDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function HabboClubCenterDialog({ hidden, onClose }: HabboClubCenterDialogProps) {
    const user = useUser();
    const userHabboClub = useUserHabboClub();

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

            <DialogContent>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                    height: 60,
                    gap: 5,
                    paddingRight: 140
                }}>
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
