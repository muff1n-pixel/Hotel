import Dialog from "@UserInterface/Common/Dialog/Dialog";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import useUserProfile from "@UserInterface/Components/Users/Hooks/useUserProfile";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import TimeSinceDate from "@UserInterface/Common/Date/TimeSinceDate";
import { useUser } from "@UserInterface/Hooks/useUser";
import BadgeImage from "@UserInterface/Common/Badges/BadgeImage";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import UserProfileRelationships from "@UserInterface/Components/Users/UserProfileRelationships";
import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import DialogItem from "@UserInterface/Common/Dialog/Components/Item/DialogItem";
import GroupBadgeImage from "@UserInterface/Components/Groups/GroupBadgeImage";
import { useEffect, useState } from "react";
import { GroupData } from "@pixel63/events";
import GroupCard from "@UserInterface/Common/Groups/Card/GroupCard";
import { useTranslation } from "react-i18next";

export type UserProfileDialogProps = {
    data: string;
    hidden?: boolean;
    onClose?: () => void;
}

export default function UserProfileDialog({ data, hidden, onClose }: UserProfileDialogProps) {
    const user = useUser();
    const dialogs = useDialogs();
    const profile = useUserProfile(data);
    const [getUserTranslation] = useTranslation("user");
    
    const [currentGroup, setCurrentGroup] = useState<GroupData>();

    useEffect(() => {
        if(!currentGroup) {
            setCurrentGroup(profile?.groups[0]);
        }
    }, [profile]);

    if(!profile) {
        return;
    }

    return (
        <Dialog title={profile.name} hidden={hidden} initialPosition="center" onClose={onClose} width={520} height={480}>
            <DialogContent style={{
                gap: 12
            }}>
                <FlexLayout direction="row">
                    <FlexLayout flex={1} direction="column">
                        <FlexLayout flex={1} direction="row">
                            <FlexLayout flex={1} align="center" justify="center" style={{
                                width: 64,
                                height: 100
                            }}>
                                <FigureImage figureConfiguration={profile.figureConfiguration} cropped direction={2}/>
                            </FlexLayout>

                            <FlexLayout flex={3} gap={5}>
                                <b>{profile.name}</b>

                                {(profile.motto && profile.motto.length > 0) && (
                                    <div style={{ fontSize: 12 }}><i>{profile.motto}</i></div>
                                )}

                                <div style={{ flex: 1 }}/>

                                <div><b>{getUserTranslation("profile.created")}:</b> <TimeSinceDate date={new Date(profile.createdAt)}/></div>
                                <div><b>{getUserTranslation("profile.last_login")}:</b> {(profile.lastOnlineAt)?(<TimeSinceDate date={new Date(profile.lastOnlineAt)}/>):("Never")}</div>
                                <div><b>{getUserTranslation("profile.achievement_score")}:</b> {profile.achievementScore.toLocaleString("en-US")}</div>

                                <FlexLayout direction="row" align="center">
                                    {(profile.online) && (
                                        <div className="sprite_users_profile_online"/>
                                    )}
                                    
                                    {(profile.id === user.id) && (
                                        <FlexLayout direction="row" align="center" gap={3}>
                                            <div className="sprite_users_profile_check"/>

                                            <b>{getUserTranslation("profile.thats_me")}</b>
                                        </FlexLayout>
                                    )}
                                </FlexLayout>
                            </FlexLayout>
                        </FlexLayout>

                        {(profile.id === user.id) && (
                            <FlexLayout direction="row" justify="space-between">
                                <DialogLink onClick={() => dialogs.addUniqueDialog("wardrobe")}>{getUserTranslation("profile.change_looks")}</DialogLink>

                                <DialogLink onClick={() => dialogs.addUniqueDialog("inventory", { tab: "badges" })}>{getUserTranslation("profile.change_badges")}</DialogLink>
                            </FlexLayout>
                        )}

                        {(profile.badges.length > 0)?(
                            <FlexLayout flex={1} gap={5} align="center" justify="space-between" direction="row" style={{
                                background: "#AEAEAE",
                                borderRadius: 6,
                                padding: 5
                            }}>
                                {profile.badges.slice(0, 5).map((badge) => (
                                    <BadgeImage badge={badge}/>
                                ))}
                            </FlexLayout>
                        ):(
                            <div style={{ flex: 1 }}/>
                        )}
                    </FlexLayout>

                    <div style={{ width: 1, background: "#AFAFAF" }}/>
                    
                    <div style={{ flex: 1 }}>
                        <FlexLayout gap={5}>
                            <div><b>{getUserTranslation("profile.friends")}:</b> {profile.friendsCount}</div>

                            <FlexLayout justify="space-between">
                                <div><b>{getUserTranslation("profile.relationships")}:</b></div>

                                <FlexLayout direction="row" gap={0}>
                                    <div style={{ padding: 5 }}>
                                        <div className="sprite_users_relationships_heart"/>
                                    </div>

                                    <UserProfileRelationships relationships={profile.loveRelationships}/>
                                </FlexLayout>

                                <FlexLayout direction="row" gap={0}>
                                    <div style={{ padding: 5 }}>
                                        <div className="sprite_users_relationships_smile"/>
                                    </div>

                                    <UserProfileRelationships relationships={profile.smileRelationships}/>
                                </FlexLayout>

                                <FlexLayout direction="row" gap={0}>
                                    <div style={{ padding: 5 }}>
                                        <div className="sprite_users_relationships_bobba"/>
                                    </div>

                                    <UserProfileRelationships relationships={profile.bobbaRelationships}/>
                                </FlexLayout>
                            </FlexLayout>
                        </FlexLayout>
                    </div>
                </FlexLayout>

                <FlexLayout flex={1} direction="row" gap={5}>
                    <FlexLayout flex={1} gap={5}>
                        <div><b>{getUserTranslation("profile.groups")}:</b> {profile.groups.length}</div>

                        <DialogScrollArea hideInactive>
                            <FlexLayout direction="column">
                                {profile.groups.map((group) => (
                                    <DialogItem width={50} key={group.id} active={currentGroup?.id === group.id} onClick={() => setCurrentGroup(group)}>
                                        <GroupBadgeImage data={group.badge}/>
                                    </DialogItem>
                                ))}
                            </FlexLayout>
                        </DialogScrollArea>
                    </FlexLayout>

                    <FlexLayout flex={5} style={{
                        background: "#AEAEAE",
                        borderRadius: 8,
                        padding: "12px 30px"
                    }}>
                        <GroupCard data={currentGroup}/>
                    </FlexLayout>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
