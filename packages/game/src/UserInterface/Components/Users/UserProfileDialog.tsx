import Dialog from "@UserInterface/Common/Dialog/Dialog";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import useUserProfile from "@UserInterface/Components/Users/Hooks/useUserProfile";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import TimeSinceDate from "@UserInterface/Common/Date/TimeSinceDate";
import { useUser } from "@UserInterface/Hooks2/useUser";
import { Fragment } from "react/jsx-runtime";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import { useDialogs } from "@UserInterface/Hooks2/useDialogs";

export type UserProfileDialogProps = {
    data: string;
    hidden?: boolean;
    onClose?: () => void;
}

export default function UserProfileDialog({ data, hidden, onClose }: UserProfileDialogProps) {
    const user = useUser();
    const dialogs = useDialogs();
    const profile = useUserProfile(data);

    if(!profile) {
        return;
    }

    return (
        <Dialog title={profile.name} hidden={hidden} initialPosition="center" onClose={onClose} width={520} height={535}>
            <DialogContent>
                <FlexLayout direction="row">
                    <FlexLayout flex={1} direction="column">
                        <FlexLayout flex={1} direction="row">
                            <FlexLayout flex={1} align="center" justify="center">
                                <FigureImage figureConfiguration={profile.figureConfiguration} cropped direction={2}/>
                            </FlexLayout>

                            <FlexLayout flex={3} gap={5}>
                                <b>{profile.name}</b>

                                {(profile.motto && profile.motto.length > 0) && (
                                    <div style={{ fontSize: 12 }}><i>{profile.motto}</i></div>
                                )}

                                <div style={{ flex: 1 }}/>

                                <div><b>Created:</b> <TimeSinceDate date={new Date(profile.createdAt)}/></div>
                                <div><b>Last login:</b> {(profile.lastOnlineAt)?(<TimeSinceDate date={new Date(profile.lastOnlineAt)}/>):("Never")}</div>

                                <FlexLayout direction="row" align="center">
                                    {(profile.online) && (
                                        <div className="sprite_users_profile_online"/>
                                    )}
                                    
                                    {(profile.id === user.id) && (
                                        <FlexLayout direction="row" align="center" gap={3}>
                                            <div className="sprite_users_profile_check"/>

                                            <b>That's me!</b>
                                        </FlexLayout>
                                    )}
                                </FlexLayout>
                            </FlexLayout>
                        </FlexLayout>

                        {(profile.id === user.id) && (
                            <FlexLayout direction="row" justify="space-between">
                                <DialogLink onClick={() => dialogs.addUniqueDialog("wardrobe")}>Change Looks</DialogLink>

                                <DialogLink onClick={() => dialogs.addUniqueDialog("inventory", { tab: "badges" })}>Change Badges</DialogLink>
                            </FlexLayout>
                        )}

                        {(profile.badges.length > 0) && (
                            <FlexLayout flex={1} gap={5} align="center" justify="space-between" direction="row" style={{
                                background: "#AEAEAE",
                                borderRadius: 6,
                                padding: 5
                            }}>
                                {profile.badges.slice(0, 5).map((badge) => (
                                    <BadgeImage badge={badge}/>
                                ))}
                            </FlexLayout>
                        )}
                    </FlexLayout>

                    <div style={{ width: 1, background: "#AFAFAF" }}/>
                    
                    <div style={{ flex: 1 }}>
                        <FlexLayout gap={5}>
                            <div><b>Friends:</b> {profile.friendsCount}</div>
                        </FlexLayout>
                    </div>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
